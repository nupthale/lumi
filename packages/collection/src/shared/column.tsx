import { ColumnTypeEnum } from '@collection/interface';

import { i18next } from '@collection/i18next';

export const getColumnTypeText = (type: ColumnTypeEnum) => {
    const map = {
        [ColumnTypeEnum.TEXT]: i18next.t('collection.columnType.text'),
        [ColumnTypeEnum.NUMBER]: i18next.t('collection.columnType.number'),
        [ColumnTypeEnum.DATE]: i18next.t('collection.columnType.date'),
        [ColumnTypeEnum.SELECT]: i18next.t('collection.columnType.select'),
        [ColumnTypeEnum.CURRENCY]: i18next.t('collection.columnType.currency'),
        [ColumnTypeEnum.IMAGE]: i18next.t('collection.columnType.image'),
    };

    return map[type];
}