import { Subject } from 'rxjs';

import { ColumnType, OrderType, ViewType, FilterType, FileType, ColumnConfigType, ViewCardConfigType } from './interface';

// 添加记录
export const addRow$ = new Subject<{ 
    id: string; 
    rowId?: string, 
    direction?: 'below' | 'above', 
    count?: number 
}>();

export const deleteRow$ = new Subject<{
    id: string;
    rowId: string;
}>();

export const addCol$ = new Subject<{
    id: string; 
    columnId?: string,
    direction?: 'right' | 'left',
    column: ColumnType,
}>();

export const addView$ = new Subject<{
    id: string;
    view: ViewType;
}>();

export const switchView$ = new Subject<{
    id: string;
    view: ViewType;
}>();

export const deleteView$ = new Subject<{
    id: string;
    view: ViewType;
}>();

export const updateViewName$ = new Subject<{
    id: string;
    viewId: string;
    name: string;
}>();

export const updateColSchema$ = new Subject<{
    id: string,
    column: ColumnType,
}>();

export const updateColumnOrder$ = new Subject<{
    id: string,
    viewId: string,
    oldIndex: number,
    newIndex: number,
}>();

// 修改某个视图下的columnConfig
export const updateColumnConfig$ = new Subject<{
    id: string,
    viewId: string,
    columnId: string,
    config: Partial<ColumnConfigType>,
}>();

// 修改某个视图下的cardConfig
export const updateViewCardConfig$ = new Subject<{
    id: string,
    viewId: string,
    config: ViewCardConfigType,
}>();

export const sort$ = new Subject<{
    id: string,
    viewId: string,
    orders: OrderType[],
}>();

export const filter$ = new Subject<{
    id: string,
    viewId: string,
    filter: FilterType,
}>();

export const group$ = new Subject<{
    id: string,
    viewId: string,
    groupBy?: {
        columnId: string;
    },
}>();

export const hideDropdown$ = new Subject<void>();

export const cellValueUpdate$ = new Subject<{
    id: string,
    rowId: string,
    columnId: string,
    value: any,
}>();

export const cellFileUploading$ = new Subject<{
    id: string,
    rowId: string,
    columnId: string,
    file: FileType,
}>();

export const cellFileUploaded$ = new Subject<{
    id: string,
    rowId: string,
    columnId: string,
    // 临时生成的id
    fileId: string,
    file: FileType,
}>();

export const activeCell$ = new Subject<{
    id: string,
    // group分组的value的值
    groupKey?: string,
     // rowId就是values数组里的id字段
    rowId: string,
    columnId: string,
} | null>();

export const updateSelectionValue$ = new Subject<{
    id: string,
    // rowIds就是values数组里的id字段
    rowIds: string[],
    refCell: {
        rowId: string,
        columnId: string,
    },
}>();

export const collectionSizeUpdate$ = new Subject<{
    id: string;
}>();

export const updateColumnWidth$ = new Subject<{
    id: string,
    columnId: string,
    width: number,
}>();