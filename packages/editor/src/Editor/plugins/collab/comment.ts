import { getYDoc } from './core';
import { commentStore } from '../../store/comment';

// 从文档的 Y.Doc 中获取评论数据
/**
 * 
 * 目前comments是整体一个大对象， 里面都是普通object， 只能每次全量更新，对比如下：
 * 核心区别总结：
 * 普通 Object
 * ❌ 无协作同步：修改对象内部属性时，Yjs 不知道发生了变化
 * ❌ 覆盖式更新：多人同时修改会导致数据丢失
 * ❌ 无法监听：不能监听对象内部的变化
 * ❌ 传输效率低：每次都要传输整个对象
 * ✅ 适合静态数据：配置、常量等不变数据
 * 
 * Y.Map
 * ✅ 精细协作：每个 key 的修改都能独立同步
 * ✅ 冲突解决：使用 CRDT 算法智能合并冲突
 * ✅ 事件监听：可以监听所有增删改操作
 * ✅ 增量同步：只传输变化的部分
 * ✅ 原子操作：支持事务，批量操作
 * 
 * 第一版暂时先用粗犷的方式， 普通object， 后续有必要的话， 再用 Y.Map
 */
const getCommentsDoc = (fileId: string) => {
  const ydoc = getYDoc(fileId);
  return ydoc.getMap('comments');
};

// 同步到本地 store
const syncToLocal = (fileId: string) => {
  const commentsDoc = getCommentsDoc(fileId);
  const json = commentsDoc.toJSON();

  commentStore.getState().setComment(
    json.docComments || {}, 
    json.commentInfoMap || {}
  );
};

// 从 store 同步到 yjs
export const syncToRemote = (fileId: string, docComments: any, commentInfoMap: any) => {
  const commentsDoc = getCommentsDoc(fileId);

  commentsDoc.set('docComments', docComments);
  commentsDoc.set('commentInfoMap', commentInfoMap);
};

let commentListener: any = null;

// 监听远程变化
export const setupCommentListener = (fileId: string) => {
  const commentsDoc = getCommentsDoc(fileId);
  
  commentListener = () => {
    syncToLocal(fileId);
  };

  commentsDoc.observe(commentListener);
};

export const removeCommentListener = (fileId: string) => {
  const commentsDoc = getCommentsDoc(fileId);
  if (commentListener) {
    commentsDoc.unobserve(commentListener);
  }
};