import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

const workerYDocMap = new Map<string, Y.Doc>();
const workerPersistenceMap = new Map<string, IndexeddbPersistence>();

// Worker中独立的Y.Doc实例
export const getWorkerYDoc = async (fileId: string): Promise<Y.Doc> => {
  if (!workerYDocMap.has(fileId)) {
    const ydoc = new Y.Doc();
    
    // 使用相同的fileId，但这是独立的实例
    const persistence = new IndexeddbPersistence(fileId, ydoc);
    
    // 等待同步完成
    await persistence.whenSynced;
    
    workerYDocMap.set(fileId, ydoc);
    workerPersistenceMap.set(fileId, persistence);
  }
  
  return workerYDocMap.get(fileId)!;
};

// 获取worker中的collections数据
export const getWorkerCollectionsData = async (fileId: string): Promise<any> => {
  const ydoc = await getWorkerYDoc(fileId);
  const collectionsMap = ydoc.getMap('collections');
  
  return collectionsMap.toJSON();
};

// 获取特定collection
export const getWorkerCollectionById = async (fileId: string, collectionId: string): Promise<any> => {
  const collectionsData = await getWorkerCollectionsData(fileId);
  return collectionsData[collectionId] || null;
};

// 监听变化（worker中）
export const watchWorkerCollectionChanges = async (fileId: string, callback: (data: any) => void) => {
  const ydoc = await getWorkerYDoc(fileId);
  const collectionsMap = ydoc.getMap('collections');
  
  const observer = () => {
    const data = collectionsMap.toJSON();
    callback(data);
  };
  
  collectionsMap.observe(observer);
  
  return () => {
    collectionsMap.unobserve(observer);
  };
};

// 清理资源
export const cleanupWorkerYDoc = (fileId: string) => {
  const persistence = workerPersistenceMap.get(fileId);
  if (persistence) {
    persistence.destroy();
    workerPersistenceMap.delete(fileId);
  }
  
  const ydoc = workerYDocMap.get(fileId);
  if (ydoc) {
    ydoc.destroy();
    workerYDocMap.delete(fileId);
  }
};

// Worker消息处理
self.onmessage = async (event) => {
  const { type, fileId, collectionId, data } = event.data;
  
  try {
    switch (type) {
      case 'GET_COLLECTIONS':
        const collections = await getWorkerCollectionsData(fileId);
        self.postMessage({ type: 'COLLECTIONS_RESULT', data: collections });
        break;
        
      case 'GET_COLLECTION':
        const collection = await getWorkerCollectionById(fileId, collectionId);
        self.postMessage({ type: 'COLLECTION_RESULT', data: collection });
        break;
        
      case 'CALCULATE':
        const calcData = await getWorkerCollectionById(fileId, collectionId);
        // 执行你的计算逻辑
        const result = performCalculations(calcData);
        self.postMessage({ type: 'CALCULATION_RESULT', data: result });
        break;
        
      case 'CLEANUP':
        cleanupWorkerYDoc(fileId);
        self.postMessage({ type: 'CLEANUP_COMPLETE' });
        break;
    }
  } catch (error) {
    self.postMessage({ type: 'ERROR', error: error.message });
  }
};

// 示例计算函数
function performCalculations(collectionData: any) {
  // 这里实现你的计算逻辑
  if (!collectionData || !collectionData.values) {
    return null;
  }
  
  // 示例：计算总数
  const values = collectionData.values;
  const count = values.length;
  
  return {
    count,
    timestamp: Date.now()
  };
}