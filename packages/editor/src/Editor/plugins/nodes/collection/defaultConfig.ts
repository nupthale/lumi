
import { ViewEnum, ColumnTypeEnum, NumberFormatEnum } from '@collection/interface';

import { i18next } from '@collection/i18next';

const getDefaultViews = () => [{
    id: 'defaultView',
    name: i18next.t('collection.defaultView'),
    type: ViewEnum.GRID,
    columnsConfig: [
      { id: 'defaultColumnText', hidden: false },
      { id: 'defaultColumnNumber', hidden: false },
      { id: 'defaultColumnDate', hidden: false },
    ],
    cardConfig: {},
}];
  
export const getDefaultSchema = () => {
    const defaultViews = getDefaultViews();

    return {
        viewId: defaultViews[0].id,
        views: defaultViews,
        columns: [
            { 
                id: 'defaultColumnText', 
                type: ColumnTypeEnum.TEXT, 
                title: '文本', 
                width: 180,
                config: {}, 
            },
            { 
                id: 'defaultColumnNumber', 
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
                id: 'defaultColumnDate', 
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

export const getDefaultValues = () => [
    { id: 'defaultId1' },
    { id: 'defaultId2' },
    { id: 'defaultId3' },
];