# 协同编辑系统使用指南

## 概述

协同编辑系统已经重构为支持多文档协同，每个文档都有独立的 provider 和房间。**评论和文档内容共享同一个 Y.Doc 连接**，这样可以减少连接数量，提高性能和稳定性。

## 主要改进

1. **多文档支持**：每个文档使用独立的 `fileId` 作为房间标识
2. **统一连接**：评论和文档内容共享同一个 Y.Doc 和 WebSocket 连接
3. **资源管理**：自动管理不同文档的 provider 和 Y.Doc 实例
4. **统一管理**：通过 `CollabManager` 统一管理所有文档的协同编辑
5. **向后兼容**：保留原有的 API 以支持现有代码

## 架构设计

### Y.Doc 数据结构

每个文档的 Y.Doc 包含以下数据结构：

```typescript
const ydoc = getYDoc(fileId);

// 文档内容（ProseMirror 使用）
const sharedDoc = ydoc.getXmlFragment('prosemirror');

// 评论数据
const commentsDoc = ydoc.getMap('comments');
// - docComments: 文档评论映射
// - commentInfoMap: 评论详细信息

// 用户状态（通过 awareness）
const provider = getProvider(fileId);
const awareness = provider.awareness;
// - 在线用户信息
// - 光标位置
// - 用户状态
```

### 连接复用

- **单一 WebSocket 连接**：每个文档只有一个 WebSocket 连接
- **统一同步**：文档内容、评论、用户状态都通过同一个连接同步
- **减少资源消耗**：避免创建多个连接导致的性能问题

## 使用方法

### 1. 初始化文档协同编辑

```typescript
import { collabManager } from './plugins/collab';

// 初始化文档的协同编辑
collabManager.initDocumentCollab(
  fileId,           // 文档的唯一标识符
  user,             // 用户信息（可选）
  initialComments   // 初始评论数据（可选）
);
```

### 2. 获取协同编辑插件

```typescript
import { collabManager } from './plugins/collab';

// 获取文档的协同编辑插件
const collabPlugins = collabManager.getCollabPlugins(fileId);

// 在 ProseMirror 编辑器中使用
const editor = new EditorView(dom, {
  state: EditorState.create({
    doc: schema.node('doc'),
    plugins: [
      ...otherPlugins,
      ...collabPlugins  // 添加协同编辑插件
    ]
  })
});
```

### 3. 评论功能

评论数据自动与文档内容同步，无需额外配置：

```typescript
// 评论会自动同步到远程
commentStore.getState().addCommentInfo(commentId, content);

// 远程评论变化会自动同步到本地
commentStore.getState().setComment(docComments, commentInfoMap);
```

### 4. 用户状态

用户状态（在线用户、光标位置等）也通过同一个连接同步：

```typescript
// 设置当前用户
setCollabUserWithFileId(fileId, user);

// 获取在线用户列表
const onlineUsers = getOnlineUsers(fileId);
```

### 5. 清理文档协同编辑

```typescript
// 清理单个文档的协同编辑
collabManager.cleanupDocumentCollab(fileId);

// 清理所有文档的协同编辑
collabManager.cleanupAll();
```

## API 参考

### CollabManager

#### `initDocumentCollab(fileId: string, user?: UserType, initialComments?: any)`
初始化文档的协同编辑，包括文档内容、评论和用户状态。

#### `getCollabPlugins(fileId: string): Plugin[]`
获取文档的协同编辑插件。

#### `cleanupDocumentCollab(fileId: string)`
清理文档的协同编辑资源。

#### `cleanupAll()`
清理所有文档的协同编辑资源。

#### `isDocumentActive(fileId: string): boolean`
检查文档是否已初始化协同编辑。

#### `getActiveFileIds(): string[]`
获取所有活跃的文档 ID。

### 核心 API

#### `getYDoc(fileId: string): Y.Doc`
获取指定文档的 Y.Doc 实例。

#### `getProvider(fileId: string): WebsocketProvider | null`
获取指定文档的 WebSocket provider。

#### `getSharedDoc(fileId: string): Y.XmlFragment`
获取指定文档的共享文档片段（用于 ProseMirror）。

#### `cleanupDocument(fileId: string)`
清理指定文档的资源。

### 评论 API

#### `initComments(fileId: string, docComments: any, commentInfoMap: any)`
初始化评论数据。

#### `syncToRemote(fileId: string, docComments: any, commentInfoMap: any)`
将评论数据同步到远程。

#### `setupCommentListener(fileId: string)`
设置评论变化监听器。

### 用户 API

#### `setCollabUser(fileId: string, user: UserType)`
设置协同编辑用户。

#### `getOnlineUsers(fileId: string): UserType[]`
获取在线用户列表。

#### `setupUserListener(fileId: string)`
设置用户状态变化监听器。

## 数据同步流程

### 文档内容同步
1. 用户编辑文档
2. ProseMirror 更新本地状态
3. y-prosemirror 插件将变化同步到 `sharedDoc`
4. Y.Doc 通过 WebSocket 将变化发送到服务器
5. 服务器广播给其他用户
6. 其他用户的 Y.Doc 接收变化并更新 `sharedDoc`
7. y-prosemirror 插件将变化应用到 ProseMirror 编辑器

### 评论同步
1. 用户添加/修改评论
2. 评论 store 更新本地状态
3. 调用 `syncToRemote` 将评论数据同步到 Y.Doc
4. Y.Doc 通过同一个 WebSocket 连接发送变化
5. 服务器广播给其他用户
6. 其他用户的 Y.Doc 接收变化
7. 评论监听器触发，更新本地评论 store

### 用户状态同步
1. 用户上线/下线或状态变化
2. awareness 更新本地状态
3. 通过同一个 WebSocket 连接发送变化
4. 服务器广播给其他用户
5. 其他用户的 awareness 接收变化
6. 用户监听器触发，更新在线用户列表

## 迁移指南

### 从旧版本迁移

如果你之前使用的是全局的 `provider` 和 `sharedDoc`，需要按以下步骤迁移：

1. **替换导入**：
   ```typescript
   // 旧版本
   import { provider, sharedDoc } from './plugins/collab/core';
   
   // 新版本
   import { collabManager } from './plugins/collab';
   ```

2. **初始化协同编辑**：
   ```typescript
   // 在文档加载时初始化
   collabManager.initDocumentCollab(fileId, user);
   ```

3. **获取插件**：
   ```typescript
   // 旧版本
   import { collab } from './plugins/collab';
   
   // 新版本
   const collabPlugins = collabManager.getCollabPlugins(fileId);
   ```

4. **清理资源**：
   ```typescript
   // 在文档卸载时清理
   collabManager.cleanupDocumentCollab(fileId);
   ```

## 注意事项

1. **房间命名**：每个文档的房间名格式为 `prosemirror-lumi-doc-room-${fileId}`
2. **连接复用**：评论和文档内容共享同一个 WebSocket 连接，减少资源消耗
3. **资源管理**：记得在文档卸载时调用清理方法，避免内存泄漏
4. **用户信息**：确保在初始化时传入正确的用户信息
5. **错误处理**：添加适当的错误处理，特别是在网络连接失败时
6. **数据一致性**：评论和文档内容通过同一个 Y.Doc 同步，确保数据一致性

## 示例

```typescript
// 完整的协同编辑使用示例
import { collabManager } from './plugins/collab';

class DocumentEditor {
  private fileId: string;
  private user: UserType;

  constructor(fileId: string, user: UserType) {
    this.fileId = fileId;
    this.user = user;
  }

  async init() {
    // 初始化协同编辑（包括文档内容、评论、用户状态）
    collabManager.initDocumentCollab(this.fileId, this.user);
    
    // 获取协同编辑插件
    const collabPlugins = collabManager.getCollabPlugins(this.fileId);
    
    // 创建编辑器
    this.editor = new EditorView(dom, {
      state: EditorState.create({
        doc: schema.node('doc'),
        plugins: [
          ...basePlugins,
          ...collabPlugins
        ]
      })
    });
  }

  destroy() {
    // 清理协同编辑资源
    collabManager.cleanupDocumentCollab(this.fileId);
  }
}
``` 