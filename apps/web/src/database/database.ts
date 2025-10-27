import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

import type { DocSchema } from './schema/doc';
import type { FileSchema } from './schema/file';
import type { SpaceSchema } from './schema/space';
import type { SpaceAssetsSchema } from './schema/spaceAsset';
import type { WikiSchema } from './schema/wiki';
import type { WikiTreeSchema } from './schema/wikiTree';
import type { JournalStatSchema } from './schema/journalStat';
import type { SharableBase } from './schema/_common';

import { createIndexes } from './schema/index';

import { uniqueId } from '@/shared/id';

import { databaseChange$, databaseInitPullSuccess$, databaseInitPullFailed$ } from './events';
import { AppModeEnum } from '../types/setting';

PouchDB.plugin(PouchDBFind);

type OnlyProperties<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
  }[keyof T];

export type DatabaseKey = OnlyProperties<Database>;

const remoteCouchBase = `https://127.0.0.1:443`;

export class Database {
    // 先不考虑未登录的情况， 先不考虑退出登录的情况
    // spaces， 不同用户不共享
    public spaces: PouchDB.Database<SpaceSchema> | undefined;
    // doc内容的分享是通过yjs房间分享的，docs内容本身是本地的；能拿到房间号， 就可以拿到文件内容。
    public docs: PouchDB.Database<DocSchema> | undefined;
    public spaceAssets: PouchDB.Database<SpaceAssetsSchema> | undefined;
    public journalStats: PouchDB.Database<JournalStatSchema> | undefined;

    // 分享表
    public files: PouchDB.Database<FileSchema> | undefined;
    public wikis: PouchDB.Database<WikiSchema> | undefined;
    public wikiTrees: PouchDB.Database<WikiTreeSchema> | undefined;

    public userId: string | undefined;

    async init(userId: string) {
        this.userId = userId;

        // 1. 创建数据库
        // 用户专属库
        this.spaces = new PouchDB<SpaceSchema>(`spaces_${userId}`);
        this.spaceAssets = new PouchDB<SpaceAssetsSchema>(`spaceassets_${userId}`);
        this.journalStats = new PouchDB<JournalStatSchema>(`journalStats_${userId}`);

        // 可分享的库
        this.files = new PouchDB(`files_${userId}`);
        this.wikis = new PouchDB(`wikis_${userId}`);
        this.wikiTrees = new PouchDB(`wikitrees_${userId}`);

        // 2. 创建索引
        await createIndexes(this);

        // 如果是local模式， 不需要同步
        if (window.__appMode__ === AppModeEnum.SYNC) {
          // 3. 先做一次一次性的pull拉取， 第一次拉取完， 再进入页面
          await this.pullOnce();

          // 4. 再开始live: true 持续同步 
          this.sync();
        }

        this.watchChange();
    }

    getDatabases = () => {
      const list: [PouchDB.Database, string][] = [];

      list.push([this.spaces!, `${remoteCouchBase}/spaces_${this.userId}`]);
      list.push([this.spaceAssets!, `${remoteCouchBase}/spaceassets_${this.userId}`]);
      list.push([this.journalStats!, `${remoteCouchBase}/journalStats_${this.userId}`]);
      list.push([this.files!, `${remoteCouchBase}/files`]);
      list.push([this.wikis!, `${remoteCouchBase}/wikis`]);
      list.push([this.wikiTrees!, `${remoteCouchBase}/wikitrees`]);

      return list;
    }

    async checkConnection() {
      const databases = this.getDatabases();

      const remoteDb = databases[0][1];
      // pull前， 先检查链接是否可访问， 如果不访问， 直接进入页面，否则useBootstrap一直不ready
      let remoteInst: PouchDB.Database = new PouchDB(remoteDb);

      try {
        await remoteInst.info();
      } catch(e) {
        throw e;
      } finally {
        remoteInst?.destroy?.();
      }
    }

    async pullOnce() {
      const databases = this.getDatabases();

      try {
        await this.checkConnection();

        for (const [localDb, remoteDb] of databases) {
          await this.pullOnceDb(localDb, remoteDb);
        }

        databaseInitPullSuccess$.next();
      } catch(e) {
        console.error(e);

        databaseInitPullFailed$.next();
      }
    }

    async pullOnceDb(db: PouchDB.Database, remoteDb: string) {
      return new Promise((resolve, reject) => {
        const opts = this.getPullOpts(db, false);

        const pull = db.replicate.from(remoteDb, opts);

        pull.on('complete', (info) => {
          console.info(`[同步初始化完成:${db.name}]`, info);
          resolve('success');
        });

        pull.on('error', (err) => {
          console.error(`[同步初始化失败:${db.name}]`, err);
          reject(err);
        });

        pull.on('denied', (err) => {
          console.error(`[同步初始化Denied:${db.name}]`, err);
          reject(err);
        });
      });
    }

    getPullOpts = (db: PouchDB.Database, live: boolean) => {
      const opts: PouchDB.Replication.SyncOptions = { live, retry: true };

      const filterMap: Record<string, string> = {
        [`files_${this.userId}`]: 'shared/filesByUser',
        [`wikis_${this.userId}`]: 'shared/wikisByUser',
        [`wikitrees_${this.userId}`]: 'shared/wikiTreesByUser',
      };

      if (filterMap[db.name]) {
        // 很奇怪， 加上这个， 就不会从远端同步， 去掉反而过滤了userId， 还同步？ 怎么回事？
        opts.filter = filterMap[db.name];
        opts.query_params = { userId: this.userId };
      }

      return opts;
    }

    syncDb(db: PouchDB.Database, remote: string) {
      const opts: PouchDB.Replication.SyncOptions = this.getPullOpts(db, true);

      // pull: 使用replicate分别处理两个方向, pull需要filter， push不需要
      db.replicate.from(remote, opts);

      // push: push不需要filter
      db.replicate.to(remote, {
        live: true,
        retry: true,
      });
    }

    async sync() {
        // https://stackoverflow.com/questions/48099582/maximum-number-of-live-replications-in-pouchdb
        // https://github.com/pouchdb/pouchdb/issues/8218
        // 启用http2， 可以解除限制
        this.getDatabases().forEach(([localDb, remoteDb]) => {
          this.syncDb(localDb, remoteDb);
        });
    }

    // 监听本地变化
    watchChange() {
      const keys = ['spaces', 'spaceAssets', 'journalStats', 'files', 'wikis', 'wikiTrees'] as DatabaseKey[];
      
      keys.forEach(key => {
          const db = this[key] as PouchDB.Database;
          
          // 监听本地变化
          db?.changes({
              live: true,
              since: 'now',
          }).on('change', (change) => {
              console.info(`[LOCAL CHANGE ${db.name}]`, change);
              databaseChange$.next({ dbName: db.name });
          });
      });
  }
}

export const database = new Database();
