# Editor
![image](./shot.png)

基于 ProseMirror 的富文本编辑器，模仿飞书文档实现的合同编辑器。

## 核心特性

- 📝 文档编辑 - 支持标题、段落、列表等基础编辑功能
- 👥 协同编辑 - 基于 yjs 实现多人实时协作
- 💬 评论功能 - 支持文档批注和评论讨论
- 📑 目录导航 - 自动生成文档大纲，支持快速定位
- 🎨 样式定制 - 支持自定义文本样式和主题

## 技术栈

### 核心框架
- Vue 3 - 用于构建用户界面
- TypeScript - 提供类型支持
- Vite - 开发构建工具

### 编辑器相关
- prosemirror-* - 核心编辑器框架
  - prosemirror-state - 编辑器状态管理
  - prosemirror-view - 编辑器视图渲染
  - prosemirror-model - 文档模型定义
  - prosemirror-transform - 文档转换操作

### 协同编辑
- yjs - 协同编辑核心库
- y-prosemirror - ProseMirror 协同插件
- y-websocket - WebSocket 连接支持

### UI 组件
- ant-design-vue - UI 组件库
- @zsfe/zsui - 内部组件库

## 开发指南

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## collab 
https://github.com/yjs/y-websocket-server/tree/main
后面有空改y-redis： https://github.com/yjs/y-redis/