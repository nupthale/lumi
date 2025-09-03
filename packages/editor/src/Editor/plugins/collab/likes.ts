import * as Y from 'yjs';
import { getYDoc } from './core';

import { docLikesChange$ } from '@editor/Editor/event';

// 从文档的 Y.Doc 中获取likes数据
/**
 * {
 *  [userId1]: {
 *    username: 张三,
 *    count: 1,
 *    updateTime: 'xxxx'
 *  },
 *  [userId2]: {
 *    username: 李四,
 *    count: 2,
 *    updateTime: 'xxxx'
 *  },
 * }
 */
export const getLikesDoc = (fileId: string) => {
  const ydoc = getYDoc(fileId);
  
  // getMap 会自动创建 Map 如果它不存在
  return ydoc.getMap('likes');
};

// 获取总点赞数量
export const getTotalLikesCount = (fileId: string): number => {
    const likesDoc = getLikesDoc(fileId);
    
    // 添加安全检查
    if (!likesDoc) {
      return 0;
    }

    let total = 0;
    
    likesDoc.forEach((item) => {
      const userItem = item as Y.Map<any>;
      total += (userItem.get('count') || 0) as number;
    });
    
    return total;
};

export const getLikesUsers = (fileId: string) => {
  const likesDoc = getLikesDoc(fileId);
    
    // 添加安全检查
    if (!likesDoc) {
      return [];
    }

    const users: any[] = [];
    
    const map = likesDoc.toJSON();

    Object.keys(map).forEach((key) => {
      users.push({
        ...map[key],
        id: key,
      });
    });

    return users;
}

// 从 store 同步到 yjs
export const syncLikeCountToRemote = (fileId: string, userId: string, username: string) => {
  try {
    const ydoc = getYDoc(fileId);
    
    // 确保 ydoc 存在且有效
    if (!ydoc) {
      console.error('YDoc is null or undefined');
      return;
    }

    const likesDoc = getLikesDoc(fileId);

    // 确保 likesDoc 存在
    if (!likesDoc) {
      console.error('likesDoc is null or undefined');
      return;
    }

    // 使用更安全的方式创建和设置数据
    ydoc.transact(() => {
      try {
        // 直接创建新的用户项，避免引用问题
        const newUserItem = new Y.Map();
        newUserItem.set('username', username);
        newUserItem.set('updateTime', +new Date());
        
        // 检查是否已存在用户项
        const existingItem = likesDoc.get(userId);
        if (existingItem && existingItem instanceof Y.Map) {
          const count = existingItem.get('count') || 0;
          newUserItem.set('count', count + 1);
        } else {
          newUserItem.set('count', 1);
        }
        
        // 设置到 likes map
        likesDoc.set(userId, newUserItem);
      } catch (error) {
        console.error('Error in transaction:', error);
      }
    });
  } catch (error) {
    console.error('Error in syncLikeCountToRemote:', error);
  }
};


let likesListener: any = null;

// 监听远程变化
export const setupLikesListener = (fileId: string) => {
  const likesDoc = getLikesDoc(fileId);
  
  likesListener = () => {
    docLikesChange$.next({
      fileId,
    });
  };

  likesDoc.observe(likesListener);
};

export const removeLikesListener = (fileId: string) => {
  const likesDoc = getLikesDoc(fileId);
  if (likesListener) {
    likesDoc.unobserve(likesListener);
  }
};