直接使用y-websocket-server， 启动：pnpm run start, 

y-websocket-server和y-websocket的关系
1. y-websocket（npm 包）既有客户端也有服务端
y-websocket 这个包既包含了客户端（WebsocketProvider，用于浏览器/前端）也包含了服务端（y-websocket/bin/server.js 或 y-websocket/bin/utils.js，用于 Node.js 启动 WebSocket 协同服务）。
你在 server-yjs/index.ts 里用到的 setupWSConnection 就是 y-websocket 包里服务端的核心方法。
2. y-websocket-server 仓库和 y-websocket 包的关系
y-websocket-server 仓库 实际上就是 y-websocket 包的官方服务端实现的一个“壳”，它的核心代码和 npm 上的 y-websocket 包是一样的，只是做了一个独立的启动脚本和 Docker 支持。
你可以直接用 npx y-websocket 启动一个独立服务端，也可以像你现在这样在自己的 Node/Express 项目里用 setupWSConnection 嵌入服务端逻辑。

需要一点自己的逻辑的， 比如文档默认值的时候， 需要用y-websocket。

y-websocket-server启动方法： HOST=localhost PORT=1234 npx y-websocket

https://github.com/fadiquader/y-mongodb
persistence 用mongodb， 扩展性更好， leveldb存储本地文件数据量了后不适合。

yjs devtool访问：
https://inspector.yjs.dev/
选择: y-websocket
配置： ws://localhost:1234
room是fileId： 
