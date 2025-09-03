import { setupWSConnection, docs } from 'y-websocket/bin/utils'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 健康检查
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ response: 'ok' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // WebSocket 连接
    if (url.pathname.startsWith('/ws')) {
      if (request.headers.get('Upgrade') !== 'websocket') {
        return new Response('Expected Upgrade: websocket', { status: 426 });
      }

      const { 0: client, 1: server } = new WebSocketPair();
      
      // 设置 WebSocket 连接
      setupWSConnection(server, request, {
        gc: !url.pathname.startsWith('/ws/prosemirror-versions')
      });

      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    // 定期记录统计信息
    ctx.waitUntil((async () => {
      let conns = 0;
      docs.forEach(doc => { conns += doc.conns.size });
      
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        connections: conns,
        documents: docs.size
      }));
    })());

    // 404 for other routes
    return new Response('Not found', { status: 404 });
  }
};