
import { ViewEnum, ColumnTypeEnum, NumberFormatEnum } from '@collection/interface';
import { nanoid } from 'nanoid';

import { i18next } from '@collection/i18next';

const getDefaultViews = (columnIds: string[]) => [{
    id: 'defaultView',
    name: i18next.t('collection.defaultView'),
    type: ViewEnum.GRID,
    columnsConfig: [
      { id: columnIds[0], hidden: false },
      { id: columnIds[1], hidden: false },
      { id: columnIds[2], hidden: false },
    ],
    cardConfig: {},
}];
  
export const getDefaultSchema = () => {
    const defaultColumnIds = [
        nanoid(8),
        nanoid(8),
        nanoid(8),
    ]

    const defaultViews = getDefaultViews(defaultColumnIds);

    return {
        viewId: defaultViews[0].id,
        views: defaultViews,
        columns: [
            { 
                id: defaultColumnIds[0], 
                type: ColumnTypeEnum.TEXT, 
                title: '文本', 
                width: 180,
                config: {}, 
            },
            { 
                id: defaultColumnIds[1], 
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
                id: defaultColumnIds[2], 
                type: ColumnTypeEnum.DATE, 
                title: '日期', 
                width: 180,
                config: {
                    format: 'MMMM D, YYYY',
                },
            },
        ],
    }
};

export const getDefaultValues = () => {
    return [
        { id: nanoid(8) },
        { id: nanoid(8) },
        { id: nanoid(8) },
    ];
};