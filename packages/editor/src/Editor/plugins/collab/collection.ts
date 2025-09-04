import * as Y from 'yjs';

import { getYDoc } from './core';

import { getDefaultSchema, getDefaultValues } from '../nodes/collection/defaultConfig';

export const insertColllection = (fileId: string, collectionId: string, schema, values) => {
  const ydoc = getYDoc(fileId);
  const collectionsDoc = getCollectionsDoc(fileId);

  const collection = new Y.Map();
  collection.set('schema', schema);

  const collectionValuesDoc = new Y.Array();
  collection.set('values', collectionValuesDoc);

  ydoc.transact(() => {
    values.forEach(item => {
      const row = new Y.Map();
      collectionValuesDoc.push([row]);
  
      Object.keys(item).forEach(key => {
        row.set(key, item[key]);
      });
    });
  });
  
  collectionsDoc.set(collectionId, collection);
}

// 从文档的 Y.Doc 中获取collection数据
export const getCollectionsDoc = (fileId: string) => {
  const ydoc = getYDoc(fileId);

  return ydoc.getMap('collections');
};

export const getCollectionDoc = (fileId: string, collectionId: string) => {
  const collectionDoc = getCollectionsDoc(fileId) as Y.Map<any>;
  let collection = collectionDoc.get(collectionId) as Y.Map<any> | undefined;

  if (!collection) {
    collection = new Y.Map();
    collection.set('schema', getDefaultSchema());

    collectionDoc.set(collectionId, collection);
  }

  return collection;
};

/**
 * 这里有一个超级坑的地方， 就是所有yjs的操作， 必须先挂到ydoc上，再操作，否则不生效， 比如
 * 下面这个实现， 如果先
 * const row = new Y.Map();
 * row.set('id', `defaultId${i + 1}`);
 * collectionValuesDoc.push([row]);
 * 这样不生效， 因为row在set前， 没在ydoc树上， 必须要先挂到ydoc上， 再set， 其他的都有类似问题。
 */
export const getCollectionValuesDoc = (fileId: string, collectionId: string) => {
  const ydoc = getYDoc(fileId);
  
  const collectionDoc = getCollectionDoc(fileId, collectionId);
  let collectionValuesDoc = collectionDoc.get('values');

  if (!collectionValuesDoc) {
    ydoc.transact(() => {
      collectionValuesDoc = new Y.Array();
      collectionDoc.set('values', collectionValuesDoc);

      for (let i = 0; i < 3; i++) {
        const row = new Y.Map();
        collectionValuesDoc.push([row]);
        row.set('id', `defaultId${i + 1}`);
      }
    });
  }

  return collectionValuesDoc;
};

// 从 store 同步到 yjs
export const syncSchemaToRemote = (fileId: string, collectionId: string, schema) => {
  const collectionDoc = getCollectionDoc(fileId, collectionId);

  collectionDoc.set('schema', schema);
};