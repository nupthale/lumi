import { ViewEnum } from '@collection/interface';

import { i18next } from '@collection/i18next';

export const getViewTypeText = (type: ViewEnum) => {
    const map = {
        [ViewEnum.GRID]: i18next.t('collection.viewType.grid'),
        [ViewEnum.BOARD]: i18next.t('collection.viewType.board'),
        [ViewEnum.GALLERY]: i18next.t('collection.viewType.gallery'),
    };

    return map[type];
}