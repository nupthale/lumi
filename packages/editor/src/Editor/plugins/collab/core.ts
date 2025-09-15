import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';

import { ydocProviderSync$, ydocPersistenceSync$ } from '@editor/Editor/event';

// 存储不同文档的 provider 实例
const providerMap = new Map<string, WebsocketProvider>();
const ydocMap = new Map<string, Y.Doc>();

export const indexeddbPersistenceMap = new Map<string, IndexeddbPersistence>();

// 创建或获取指定文档的 Y.Doc
export const getYDoc = (fileId: string): Y.Doc => {
  if (!ydocMap.has(fileId)) {
    const ydoc = new Y.Doc();

    try {
      // 本地持久化
      const persistence = new IndexeddbPersistence(fileId, ydoc);
      
      console.log(`[YJS] Creating persistence for fileId: ${fileId}`);
      
      // 添加错误处理
      persistence.whenSynced.then(() => {
        console.log(`[YJS] Persistence synced for fileId: ${fileId}`);
        // 本地数据加载完成
        ydocPersistenceSync$.next({ fileId });
      }).catch((error) => {
        console.error(`[YJS] Persistence sync failed for fileId: ${fileId}`, error);
      });

      indexeddbPersistenceMap.set(fileId, persistence);
      
    } catch (error) {
      console.error(`[YJS] Failed to create persistence for fileId: ${fileId}`, error);
    }
    
    ydocMap.set(fileId, ydoc);
  }

  return ydocMap.get(fileId)!;
};

export const getProvider = (fileId: string): WebsocketProvider => {
  if (providerMap.has(fileId)) {
    return providerMap.get(fileId)!;
  }

  const ydoc = getYDoc(fileId);
  
  try {
    const provider = new WebsocketProvider(
      `ws://localhost:1234`,
      fileId, // 每个文档使用不同的房间名
      ydoc,
    );

    provider.on('sync', () => {
      console.log(`[YJS] Provider sync completed for fileId: ${fileId}`);
      console.log(`[YJS] Shared doc content after provider sync:`, ydoc.getXmlFragment('prosemirror').toString());
      ydocProviderSync$.next({ fileId });
    });

    provider.on('connection-error', (error) => {
      console.error(`[YJS] Provider connection error for fileId: ${fileId}`, error);
      // 连接错误时，也要触发事件，确保编辑器能够初始化
      console.log(`[YJS] Triggering provider sync event despite connection error for fileId: ${fileId}`);
      ydocProviderSync$.next({ fileId });
    });

    provider.on('status', (event) => {
      console.log(`[YJS] Provider status for fileId: ${fileId}:`, event.status);
      
      // Safari 兼容性处理：当状态变为 connected 时，如果一段时间后没有触发 sync 事件，手动触发
      if (event.status === 'connected') {
        ydocProviderSync$.next({ fileId });
      }
    });
    
    providerMap.set(fileId, provider);
    
    console.log(`Yjs provider initialized for document ${fileId}`);
    return provider;
  } catch (error) {
    console.error(`[YJS] Failed to create provider for fileId: ${fileId}`, error);
    // 即使创建 provider 失败，也要触发事件
    console.log(`[YJS] Triggering provider sync event despite creation error for fileId: ${fileId}`);
    ydocProviderSync$.next({ fileId });
    
    // 返回一个空的 provider 对象，避免后续调用出错
    return {} as WebsocketProvider;
  }
};

// 获取指定文档的共享文档
export const getSharedDoc = (fileId: string) => {
  const ydoc = getYDoc(fileId);
  // y-prosemirror 内部默认使用 'prosemirror' 作为命名空间，不能随便改
  const namespace = 'prosemirror';
  const sharedDoc = ydoc.getXmlFragment(namespace);
  
  console.log(`[YJS] Getting shared doc for fileId: ${fileId}`);
  console.log(`[YJS] Current content:`, sharedDoc.toString());
  
  return sharedDoc;
};

// 初始化调用一次，确保yjs内容加载完成
export const loadSharedDoc = (fileId: string, isLocalMode: boolean) => {
  getSharedDoc(fileId);
  
  if (!isLocalMode) {
    getProvider(fileId);
  }
};

// 清理指定文档的资源
export const cleanupDocument = (fileId: string) => {
  const provider = providerMap.get(fileId);
  if (provider) {
    provider.destroy();
    providerMap.delete(fileId);
  }
  
  const ydoc = ydocMap.get(fileId);
  if (ydoc) {
    ydoc.destroy();
    ydocMap.delete(fileId);
  }
};

// 清理所有文档资源
export const cleanupAllCollab = () => {
  for (const [fileId] of providerMap) {
    cleanupDocument(fileId);
  }

  // 每次unmount都清空下， 进入的时候都是重置的
  providerMap.clear();
  ydocMap.clear();
  indexeddbPersistenceMap.clear();
};