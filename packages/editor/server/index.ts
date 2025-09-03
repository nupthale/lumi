// server/index.ts
import express from 'express'
import WebSocket from 'ws'
import * as Y from 'yjs';
import { setupWSConnection } from 'y-websocket/bin/utils'
import { LeveldbPersistence } from 'y-leveldb'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000

// 创建 WebSocket 服务器
const server = app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`)
})

const wss = new WebSocket.Server({ server });

// WebSocket 连接处理
wss.on('connection', (conn, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  
  // 从URL参数中获取fileId
  const fileId = url.searchParams.get('fileId');

  if (!fileId) {
    console.log('WebSocket连接缺少fileId参数')
    return
  }
  
  console.log(`WebSocket连接: ${fileId}`)
  
  // 设置 WebSocket 连接
  setupWSConnection(conn, req, {
    gc: true,
  })
})