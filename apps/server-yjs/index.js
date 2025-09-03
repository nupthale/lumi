// server/index.js
import express from 'express'
import WebSocket from 'ws'
import * as Y from 'yjs';
import utils from 'y-websocket/bin/utils';

import { MongodbPersistence } from 'y-mongodb-provider';

import { debug, getDocumentContent } from './debug.js';

// const location = process.env.MONGODB_URI;
const location = 'mongodb://localhost:27017/yjs';
const ldb = new MongodbPersistence(location, {
	flushSize: 100,
	multipleCollections: true,
});

const app = express()
const port = process.env.PORT || 1234

debug(app, ldb, location);

// 创建 WebSocket 服务器
const server = app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`)
  console.log(`调试接口: http://localhost:${port}/debug/doc/:roomId`)
  console.log(`更新记录: http://localhost:${port}/debug/updates/:roomId`)
  console.log(`房间列表: http://localhost:${port}/debug/rooms`)
})

const wss = new WebSocket.Server({ server });

// WebSocket 连接处理
wss.on('connection', (ws, req) => {

  // CONNECT the CLIENT to YJS documents
  // use the "room" passed in `req.url` (for example "/yjs-ws-demo")
  utils.setupWSConnection(ws, req);
})

/*
 Persistence must have the following signature:
{ bindState: function(string,WSSharedDoc):void, writeState:function(string,WSSharedDoc):Promise }
*/
utils.setPersistence({
  bindState: async (roomId, ydoc) => {
    try {
      console.log(`[Server ${roomId}] Binding state`);
      
      // 获取持久化的文档
      const persistedYdoc = await ldb.getYDoc(roomId);

      if (persistedYdoc) {
        console.log(`[Server ${roomId}] Found persisted document`);
        
        // 将持久化的状态应用到当前文档
        const persistedState = Y.encodeStateAsUpdate(persistedYdoc);
        Y.applyUpdate(ydoc, persistedState);
        
        console.log(`[Server ${roomId}] Applied persisted state`);
      } else {
        console.log(`[Server ${roomId}] No persisted document found: , creating new one`);
        // 如果没有持久化的文档，创建一个新的
        await ldb.storeUpdate(roomId, Y.encodeStateAsUpdate(ydoc));
      }

      // 监听文档更新并存储到数据库
      ydoc.on('update', async (update, origin) => {
        // 避免存储来自数据库的更新（防止循环）
        if (origin !== ldb) {
          // 很奇怪， 这里第一个console.log不加update， 下面的Y.logUpdate就看不到content
          console.log(`[Server ${roomId}] Storing update`, update);
          Y.logUpdate(update);
          
          try {
            await ldb.storeUpdate(roomId, update);
            console.log(`[Server ${roomId}] Successfully stored update`);
          } catch (error) {
            console.error(`[Server ${roomId}] Failed to store update:`, error);
          }
        } else {
          console.log(`[Server ${roomId}] Skipping update from database origin`);
        }
      });
      
      console.log(`[Server ${roomId}] Successfully bound state`);
    } catch (error) {
      console.error(`[Server ${roomId}] Error in bindState`, error);
    }
  },
  writeState: async (roomId, ydoc) => {
    console.log(`[Server ${roomId}] Writing final state`);
    try {
      // 确保最终状态被写入数据库
      const finalState = Y.encodeStateAsUpdate(ydoc);
      await ldb.storeUpdate(roomId, finalState);
      console.log(`[Server ${roomId}] Successfully wrote final state`);
    } catch (error) {
      console.error(`[Server ${roomId}] Error writing final state:`, error);
    }
    return Promise.resolve();
  }
})