// 不持久化版本， 可以正常同步
import express from 'express';
import WebSocket from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

const app = express()
const port = process.env.PORT || 1234

// 创建 WebSocket 服务器
const server = app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`)
})

const wss = new WebSocket.Server({ server });

// WebSocket 连接处理
wss.on('connection', (conn, req) => {
  // 设置 WebSocket 连接
  setupWSConnection(conn, req, {
    gc: true,
  })
})