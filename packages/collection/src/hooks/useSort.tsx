import { CollectionSchemaType } from "@collection/interface";

import { compareValues } from '@collection/shared/cell';

export const useSort = (
    schema?: CollectionSchemaType,
) => {

    const sort = (a: Record<string, any>, b: Record<string, any>) => {
        const view = schema?.views.find(view => view.id === schema?.viewId);
        const orders = view?.orders;
        if (!orders?.length) return 0;
    
        for (const { columnId, order } of orders) {
        const aValue = a[columnId];
        const bValue = b[columnId];
        const cmp = compareValues(aValue, bValue, order);
        if (cmp !== 0) return cmp;
        }
        return 0;
    }
    
    return {
        sort,
    };
}