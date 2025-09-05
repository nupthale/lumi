<script lang="tsx">
import * as Y from 'yjs';
import { ref, defineComponent, Ref, onMounted } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { filter, tap } from 'rxjs/operators';
import { isNil } from 'lodash-es';


import { Collection } from '@collection/index';

import {
    addRow$,
    deleteRow$,
    addCol$,
    deleteCol$,
    updateColSchema$,
    updateColumnOrder$,
    cellValueUpdate$,
    updateColumnWidth$,
    addView$,
    deleteView$,
    switchView$,
    updateViewName$,
    sort$,
    filter$,
    group$,
    updateSelectionValue$,
    cellFileUploaded$,
    cellFileUploading$,
    updateColumnConfig$,
    updateViewCardConfig$,
} from '@collection/events';
import { nanoid } from 'nanoid';

import {
    CollectionSchemaType,
    ColumnTypeEnum,
} from '@collection/interface';

import { ydocPersistenceSync$, ydocProviderSync$ } from '@editor/Editor/event';

import { getCollectionValuesDoc, getCollectionDoc } from '@editor/Editor/plugins/collab/collection';

import { getDefaultSchema, getDefaultValues } from '../defaultConfig';
import { getYDoc } from '@editor/Editor/plugins/collab/core';

// values要用collectionValuesDoc操作， 不能用普通数组操作。读取还是用外部普通的values
export default defineComponent({
    props: {
        fileId: String,
        collectionId: String,
    },
    setup(props) {
        const ydoc = getYDoc(props.fileId!);

        const schemaRef: Ref<CollectionSchemaType> = ref(getDefaultSchema());
        const valuesRef: Ref<Record<string, any>[]> = ref(getDefaultValues());

        const getValuesDoc = () => {
            if (!props.fileId || !props.collectionId) {
                return [];
            }

            const collectionValuesDoc = getCollectionValuesDoc(props.fileId!, props.collectionId!);

            return collectionValuesDoc;
        }

        const getDataByCount = (count: number) => {
            return Array.from({ length: count }, () => {
                const ymap = new Y.Map();
                ymap.set('id', nanoid(8));
                return ymap;
            });
        }

        const updateLocal = () => {
            if (!props.fileId || !props.collectionId) {
                return;
            }

            const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
            const json = collectionDoc.toJSON();

            schemaRef.value = json.schema || getDefaultSchema();
            valuesRef.value = json.values || getDefaultValues();
        }

        onMounted(() => {
            const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
            collectionDoc.observeDeep(updateLocal);

            return () => {
                collectionDoc.unobserveDeep(updateLocal);
            }
        });

        // 本地persistence初始化完成后， 要更新一次
        useSubscription(
            ydocPersistenceSync$.pipe(
                filter(({ fileId }) => {
                    return fileId === props.fileId;
                }),
                tap(() => {
                    updateLocal();
                })
            ).subscribe()
        )

        // ydoc 同步完成后， 要更新一次
        useSubscription(
            ydocProviderSync$.pipe(
                filter(({ fileId }) => {
                    return fileId === props.fileId;
                }),
                tap(() => {
                    updateLocal();
                })
            ).subscribe()
        )


        useSubscription(
            addRow$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ rowId, direction, count = 1 }) => {
                    const valuesDoc = getValuesDoc();
                    const values = valuesDoc.toArray();

                    let insertPos = values.findIndex(item => item.get('id') === rowId);
                    if (insertPos < 0) {
                        insertPos = values.length - 1;
                    }

                    if (direction === 'above') {
                        // 在当前位置之前插入
                        insertPos = Math.max(insertPos, 0);
                    } else {
                        // 在当前位置之后插入
                        insertPos = Math.min(insertPos + 1, values.length);
                    }

                    // 用 Y.Array 的 insert 方法插入新数据
                    valuesDoc.insert(insertPos, getDataByCount(count));
                })
            ).subscribe()
        );

        useSubscription(
            deleteRow$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ rowId }) => {
                    const valuesDoc = getValuesDoc();
                    const values = valuesDoc.toArray();

                    const index = values.findIndex(item => item.get('id') === rowId);
                    if (index !== -1) {
                        valuesDoc.delete(index, 1);
                    }
                })
            ).subscribe()
        )

        useSubscription(
            addCol$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ columnId, direction, column }) => {
                    let insertPos = schemaRef.value.columns.findIndex(item => item.id === columnId);
                    if (insertPos < 0) {
                        insertPos = schemaRef.value.columns.length - 1;
                    }

                    if (direction === 'left') {
                        // 在当前位置之前插入
                        insertPos = Math.max(insertPos, 0);
                    } else {
                        // 在当前位置之后插入
                        insertPos = Math.min(insertPos + 1, schemaRef.value.columns.length);
                    }

                    schemaRef.value.columns.splice(insertPos, 0, column);

                    schemaRef.value.views.forEach(view => {
                        view.columnsConfig.splice(insertPos, 0, {
                            id: column.id,
                            hidden: false,
                        })
                    });

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });
                })
            ).subscribe()
        );

        useSubscription(
            deleteCol$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ columnId }) => {
                    let index = schemaRef.value.columns.findIndex(item => item.id === columnId);

                    schemaRef.value.columns.splice(index, 1);

                    schemaRef.value.views.forEach(view => {
                        const viewColumnIndex = view.columnsConfig.findIndex(item => item.id === columnId)

                        view.columnsConfig.splice(viewColumnIndex, 1);
                    });

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });
                })
            ).subscribe()
        )

        useSubscription(
            cellValueUpdate$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ rowId, columnId, value }) => {
                    const valuesDoc = getValuesDoc();
                    const values = valuesDoc.toArray();

                    const index = values.findIndex(item => item.get('id') === rowId);

                    if (index !== -1) {
                        const rowMap = valuesDoc.get(index);
                        rowMap.set(columnId, value);
                    }
                })
            ).subscribe()
        );

        useSubscription(
            cellFileUploading$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ rowId, columnId, file }) => {
                    const valuesDoc = getValuesDoc();
                    const values = valuesDoc.toArray();

                    ydoc.transact(() => {
                        const index = values.findIndex(item => item.get('id') === rowId);
                        if (index !== -1) {
                            const rowMap = valuesDoc.get(index);
                            let fileArray = rowMap.get(columnId);
                            if (!(fileArray instanceof Y.Array)) {
                                // 如果还不是 Y.Array，初始化为 Y.Array
                                fileArray = new Y.Array();
                                rowMap.set(columnId, fileArray);
                            }
                            fileArray.push([file]);
                        }
                    });


                })
            ).subscribe()
        )

        useSubscription(
            cellFileUploaded$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ rowId, columnId, fileId, file }) => {
                    const valuesDoc = getValuesDoc();
                    const values = valuesDoc.toArray();

                    ydoc.transact(() => {
                        const index = values.findIndex(item => item.get('id') === rowId);
                        if (index !== -1) {
                            const rowMap = valuesDoc.get(index);
                            let fileArray = rowMap.get(columnId);

                            if (!(fileArray instanceof Y.Array)) {
                                // 如果还不是 Y.Array，初始化为 Y.Array
                                fileArray = new Y.Array();
                                rowMap.set(columnId, fileArray);
                            }

                            // 遍历 Y.Array，找到 fileId 匹配的项，替换为新 file
                            const arr = fileArray.toArray();
                            const fileIndex = arr.findIndex(item => item.id === fileId);

                            if (fileIndex !== -1) {
                                // 用 delete+insert 替换
                                fileArray.delete(fileIndex, 1);
                                fileArray.insert(fileIndex, [file]);
                            }
                        }
                    });


                })
            ).subscribe()
        )

        useSubscription(
            updateColumnWidth$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ columnId, width }) => {
                    schemaRef.value.columns.find((col) => col.id === columnId)!.width = width;

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            updateSelectionValue$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ rowIds, refCell: { rowId, columnId } }) => {
                    const valuesDoc = getValuesDoc();
                    const values = valuesDoc.toArray();

                    const refRowIndex = values.findIndex(item => item.get('id') === rowId);
                    if (refRowIndex === -1) return;

                    const refRow = valuesDoc.get(refRowIndex);
                    const refValue = refRow.get(columnId);

                    ydoc.transact(() => {
                        values.forEach((row, i) => {
                            if (rowIds.includes(row.get('id'))) {
                                const rowMap = valuesDoc.get(i);
                                rowMap.set(columnId, refValue);
                            }
                        });
                    });


                })
            ).subscribe()
        )

        useSubscription(
            addView$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ view }) => {
                    schemaRef.value.views.push(view);

                    // 切换到新视图
                    schemaRef.value.viewId = view.id;

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            switchView$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ view }) => {
                    schemaRef.value.viewId = view.id;

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            deleteView$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ view }) => {
                    schemaRef.value.views = schemaRef.value.views.filter(item => item.id !== view.id);

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            updateViewName$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ viewId, name }) => {
                    schemaRef.value.views.find(item => item.id === viewId)!.name = name;

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            updateColumnOrder$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ viewId, oldIndex, newIndex }) => {
                    const view = schemaRef.value.views.find(item => item.id === viewId);

                    if (!view) {
                        return;
                    }
                    const columnConfig = view.columnsConfig[oldIndex];
                    view.columnsConfig.splice(oldIndex, 1);
                    view.columnsConfig.splice(newIndex, 0, columnConfig);

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            updateColumnConfig$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ viewId, columnId, config }) => {
                    const view = schemaRef.value.views.find(item => item.id === viewId);

                    if (!view) return;

                    const columnConfig = view.columnsConfig?.find(item => item.id === columnId);
                    if (columnConfig) {
                        if (!isNil(config.hidden)) {
                            columnConfig.hidden = config.hidden;
                        }
                    }

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            updateViewCardConfig$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ viewId, config }) => {
                    const view = schemaRef.value.views.find(item => item.id === viewId);

                    if (!view) return;

                    view.cardConfig = {
                        ...view.cardConfig,
                        ...config,
                    }

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        )

        useSubscription(
            sort$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ viewId, orders }) => {
                    const view = schemaRef.value.views.find(item => item.id === viewId);
                    if (!view) {
                        return;
                    }
                    view.orders = orders;

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            filter$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ viewId, filter }) => {
                    const view = schemaRef.value.views.find(item => item.id === viewId);
                    if (!view) {
                        return;
                    }
                    view.filter = filter;

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        );

        useSubscription(
            group$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ viewId, groupBy }) => {
                    const view = schemaRef.value.views.find(item => item.id === viewId);
                    if (!view) {
                        return;
                    }
                    view.groupBy = groupBy;

                    const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                    collectionDoc.set('schema', { ...schemaRef.value });


                })
            ).subscribe()
        )

        useSubscription(
            updateColSchema$.pipe(
                filter(({ id }) => id === props.fileId),
                tap(({ column }) => {
                    const index = schemaRef.value.columns.findIndex((col) => col.id === column.id);
                    const lastType = schemaRef.value.columns[index].type;

                    if (index >= 0) {
                        schemaRef.value.columns[index] = column;

                        const valuesDoc = getValuesDoc();
                        ydoc.transact(() => {
                            // 如果类型变化， 直接把values清空， 参考notion
                            if (lastType !== column.type) {
                                for (let i = 0; i < valuesDoc.length; i++) {
                                    const rowMap = valuesDoc.get(i);
                                    if (rowMap instanceof Y.Map) {
                                        rowMap.set(column.id, column.type === ColumnTypeEnum.IMAGE ? [] : undefined);
                                    }
                                }
                            } else {
                                // 如果是select， 修改了option， 比如减少了， 那要修改values， 把不存在的value去掉。
                                if (column.type === ColumnTypeEnum.SELECT) {
                                    const optionValues = (column.config?.options || []).map(item => item.value);

                                    for (let i = 0; i < valuesDoc.length; i++) {
                                        const rowMap = valuesDoc.get(i);
                                        if (rowMap instanceof Y.Map) {
                                            const current = rowMap.get(column.id) || [];
                                            // 只保留还存在的 option
                                            const filtered = current.filter((item) => optionValues.includes(item));
                                            rowMap.set(column.id, filtered);
                                        }
                                    }
                                }
                            }
                        });

                        const collectionDoc = getCollectionDoc(props.fileId!, props.collectionId!);
                        collectionDoc.set('schema', { ...schemaRef.value });


                    }
                })
            ).subscribe()
        )

        return () => (
            <div>
                <Collection
                    id={props.fileId}
                    schema={schemaRef.value}
                    values={valuesRef.value}
                />
            </div>
        )
    }
})

</script>