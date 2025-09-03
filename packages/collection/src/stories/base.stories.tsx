import type { Meta, StoryObj } from '@storybook/vue3';
import { useSubscription } from '@vueuse/rxjs';
import { filter, tap } from 'rxjs/operators';
import { ref } from 'vue';
import { isNil } from 'lodash-es';
import { nanoid } from 'nanoid';

import { Collection } from '../index';

import { 
  addRow$,
  deleteRow$,
  addCol$, 
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

import { 
  CollectionSchemaType,
  ViewEnum,
  ColumnTypeEnum,
  FileType,
} from '../interface';

const meta: Meta<typeof Collection> = {
  component: Collection,
};

// 👇 This default export determines where your story goes in the story list
export default meta;
type Story = StoryObj<typeof Collection>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
const containerStyle = 'display: inline-block; width: 100px;';

import { NumberFormatEnum } from '@collection/interface';

export const Base: Story = {
  render: args => {
    const views = [{
      id: '1',
      name: '默认列表视图',
      type: ViewEnum.GRID,
      columnsConfig: [
        { id: '1', hidden: false },
        { id: '2', hidden: false },
        { id: '3', hidden: false },
        { id: '4', hidden: false },
        { id: '5', hidden: false },
      ],
      cardConfig: {},
    }];

    const schema = ref<CollectionSchemaType>({
      view: views[0],
      views,
      columns: [
        { 
          id: '1', 
          type: ColumnTypeEnum.TEXT, 
          title: '文本', 
          width: 180,
          config: {}, 
        },
        { 
          id: '2', 
          type: ColumnTypeEnum.NUMBER,
          title: '数字', 
          width: 180, 
          config: {
            format: NumberFormatEnum.PERCENT,
            precision: 2,
            digitGroup: true,
          },
        },
        { 
          id: '3', 
          type: ColumnTypeEnum.DATE, 
          title: '日期', 
          width: 180,
          config: {
            format: 'MMMM D, YYYY',
          },
        },
        { 
          id: '4', 
          type: ColumnTypeEnum.SELECT, 
          title: '单选', 
          width: 180, 
          config: {
            options: [
              { color: '--R100', label: '选项1', value: '1' },
              { color: '--O100', label: '选项2', value: '2' },
              { color: '--B100', label: '选项3', value: '3' },
              { color: '--R100', label: '选项4', value: '4' },
              { color: '--G100', label: '选项5', value: '5' },
              { color: '--Y100', label: '选项6', value: '6' },
            ]
          },
        },
        { 
          id: '5', 
          type: ColumnTypeEnum.IMAGE, 
          title: '图片', 
          width: 180, 
          config: {},
        },
      ],
    });

    const values = ref<Record<string, any>[]>([
      { id: 'value1', '1': '这是一条文本1', '2': 100.3421, '3': '2025-07-07', '4': ['1'] },
      { id: 'value2', '1': '这是一条文本2', '2': 43200.253, '3': '2025-07-08', '4': ['2'] },
      { id: 'value3', '1': '这是一条文本3', '2': 235300.19, '3': '2025-07-09', '4': ['1', '2', '3', '4', '5', '6'] },
    ]);

    const getDataByCount = (count: number) => {
      const data = [];
      for(let i = 0; i < count; i++) {
        data.push({
          id: nanoid(8),
        });
      }

      return data;
    }

    useSubscription(
      addRow$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ rowId, direction, count = 1 }) => {
          let insertPos = values.value.findIndex(item => item.id === rowId);
          if (insertPos < 0) {
            insertPos = values.value.length - 1;
          }

          if (direction === 'above') {
            // 在当前位置之前插入
            insertPos = Math.max(insertPos, 0);
          } else {
            // 在当前位置之后插入
            insertPos = Math.min(insertPos + 1, values.value.length);
          }
          
          values.value.splice(insertPos, 0, ...getDataByCount(count));
          
        })
      ).subscribe()
    );

    useSubscription(
      deleteRow$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ rowId }) => {
          const index = values.value.findIndex(item => item.id === rowId);
          if (index !== -1) {
            values.value.splice(index, 1);
          }
        })
      ).subscribe()
    )

    useSubscription(
      addCol$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ columnId, direction, column }) => {
          let insertPos = schema.value.columns.findIndex(item => item.id === columnId);
          if (insertPos < 0) {
            insertPos = schema.value.columns.length - 1;
          }

          if (direction === 'left') {
            // 在当前位置之前插入
            insertPos = Math.max(insertPos, 0);
          } else {
            // 在当前位置之后插入
            insertPos = Math.min(insertPos + 1, schema.value.columns.length);
          }

          
          schema.value.columns.splice(insertPos, 0, column);

          schema.value.views.forEach(view => {
            view.columnsConfig.push({
              id: column.id,
              hidden: false,
            });
          });
        })
      ).subscribe()
    );

    useSubscription(
      cellValueUpdate$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ rowId, columnId, value }) => {
          const row = values.value.find(item => item.id === rowId);

          if (row) {
            row[columnId] = value;
          }
        })
      ).subscribe()
    );

    useSubscription(
      cellFileUploading$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ rowId, columnId, file }) => {
          const row = values.value.find(item => item.id === rowId);

          console.info('###', values.value, rowId, file)

          if (row) {
            row[columnId] = [...(row[columnId] || []), file];
          }
        })
      ).subscribe()
    )

    useSubscription(
      cellFileUploaded$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ rowId, columnId, fileId, file }) => {
          const row = values.value.find(item => item.id === rowId);

          if (row) {
            row[columnId] = (row[columnId] || []).map((item: FileType) => {
              if (item.id === fileId) {
                return {...file};
              }
              return item;
            })
          }
        })
      ).subscribe()
    )

    useSubscription(
      updateColumnWidth$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ columnId, width }) => {
          schema.value.columns.find((col) => col.id === columnId)!.width = width;
        })
      ).subscribe()
    );

    useSubscription(
      updateSelectionValue$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ rowIds, refCell: { rowId, columnId } }) => {
          console.info('###', rowIds)

          const refRow = values.value.find(item => item.id === rowId);

          if (!refRow) return;

          const refValue = refRow[columnId];

          values.value.forEach(row => {
            if (rowIds.includes(row.id)) {
              row[columnId] = refValue;
            }
          })
        })
      ).subscribe()
    )

    useSubscription(
      addView$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ view }) => {
          schema.value.views.push(view);

          // 切换到新视图
          schema.value.view = view;
        })
      ).subscribe()
    );

    useSubscription(
      switchView$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ view }) => {
          schema.value.view = view;
        })
      ).subscribe()
    );

    useSubscription(
      deleteView$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ view }) => {
          schema.value.views = schema.value.views.filter(item => item.id !== view.id);
        })
      ).subscribe()
    );

    useSubscription(
      updateViewName$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ viewId, name }) => {
          schema.value.views.find(item => item.id === viewId)!.name = name;
        })
      ).subscribe()
    );

    useSubscription(
      updateColumnOrder$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ viewId, oldIndex, newIndex }) => {
          const view = schema.value.views.find(item => item.id === viewId);

          if (!view) {
            return;
          }
          const columnConfig = view.columnsConfig[oldIndex];
          view.columnsConfig.splice(oldIndex, 1);
          view.columnsConfig.splice(newIndex, 0, columnConfig);
        })
      ).subscribe()
    );

    useSubscription(
      updateColumnConfig$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ viewId, columnId, config }) => {
          const view = schema.value.views.find(item => item.id === viewId);
          
          if (!view) return;

          const columnConfig = view.columnsConfig?.find(item => item.id === columnId);
          if (columnConfig) {
            if (!isNil(config.hidden)) {
              columnConfig.hidden = config.hidden;
            }
          }
        })
      ).subscribe()
    );

    useSubscription(
      updateViewCardConfig$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ viewId, config }) => {
          const view = schema.value.views.find(item => item.id === viewId);
          
          if (!view) return;

          view.cardConfig = {
            ...view.cardConfig,
            ...config,
          }
        })
      ).subscribe()
    )

    useSubscription(
      sort$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ viewId, orders }) => {
          const view = schema.value.views.find(item => item.id === viewId);
          if (!view) {
            return;
          }
          view.orders = orders;
        })
      ).subscribe()
    );

    useSubscription(
      filter$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ viewId, filter }) => {
          const view = schema.value.views.find(item => item.id === viewId);
          if (!view) {
            return;
          }
          view.filter = filter;
        })
      ).subscribe()
    );

    useSubscription(
      group$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ viewId, groupBy }) => {
          const view = schema.value.views.find(item => item.id === viewId);
          if (!view) {
            return;
          }
          view.groupBy = groupBy;
        })
      ).subscribe()
    )

    useSubscription(
      updateColSchema$.pipe(
        filter(({ id }) => id === '1'),
        tap(({ column }) => {
          const index = schema.value.columns.findIndex((col) => col.id === column.id);
          const lastType = schema.value.columns[index].type;

          if (index >= 0) {
            schema.value.columns[index] = column;

            // 如果类型变化， 直接把values清空， 参考notion
            if (lastType !== column.type) {
              values.value.forEach((v) => {
                v[column.id] = '';
              })
            } else {
              // 如果是select， 修改了option， 比如减少了， 那要修改values， 把不存在的value去掉。
              if (column.type === ColumnTypeEnum.SELECT) {
                const optionValues = (column.config?.options || []).map((item) => item.value);

                values.value.forEach((v) => {
                  v[column.id] = (v[column.id] || []).filter((item: string) => optionValues.includes(item));
                })
              }
            }
          }
        })
      ).subscribe()
    )

    return () => (
      <div class="flex justify-center">
        <div style="width: 600px;">
          <Collection id="1" schema={schema.value} values={values.value} />
        </div>
      </div>
    );
  },
  args: {
  },
};