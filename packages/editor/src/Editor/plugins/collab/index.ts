import { setupUserListener, removeUserListener, setCollabUser } from './user';

import { setupCommentListener, removeCommentListener } from './comment';

import { setupLikesListener, removeLikesListener } from './likes';

export const initDocumentCollab = (fileId: string, user?: any) => {
    try {
      // 设置用户监听
      setupUserListener(fileId);
    
      // 设置评论监听
      setupCommentListener(fileId);
    
      // 如果有用户信息，设置协同用户
      if (user) {
        setCollabUser(fileId, user);
      }

      setupLikesListener(fileId);
    } catch (error) {
      console.error(`[Collab] Failed to initialize collab for fileId: ${fileId}`, error);
      // 即使初始化失败，也要继续，确保编辑器能够正常工作
    }
}

export const removeDocumentCollab = (fileId: string) => {
  removeUserListener(fileId);
  removeCommentListener(fileId);
  removeLikesListener(fileId);
}