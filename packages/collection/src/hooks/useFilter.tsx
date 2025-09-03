
import { isNil, isEmpty, isEqual, isNumber, isString, isObject, isArray } from 'lodash-es';
import dayjs from 'dayjs';

import { CollectionSchemaType, OperatorEnum, FilterMatchEnum, ConditionType, ColumnTypeEnum, ColumnType, DateColumnType } from "@collection/interface";

export const useFilter = (
    schema?: CollectionSchemaType,
) => {

    const getFormatDateValue = (val: string, column: DateColumnType) => {
        return dayjs(val).format(column.config.format);
    }

    const matchDateValue = (item: Record<string, any>, condition: ConditionType) => {
        const { columnId, operator, value } = condition;
        const column = schema?.columns.find(column => column.id === columnId) as DateColumnType;
        if (!columnId || !operator || !column) return true;

        const itemValue = item[columnId];

        let formatValue = dayjs(value as string).format(column.config.format);
        let formatItemValue = dayjs(itemValue).format(column.config.format);

        switch(operator) {
            case OperatorEnum.IS_NULL:
                return isNil(itemValue);
            case OperatorEnum.IS_NOT_NULL:
                return !isNil(itemValue);
            case OperatorEnum.EQUAL:
                return formatValue === formatItemValue;
            case OperatorEnum.NOT_EQUAL:
                return formatValue !== formatItemValue;
            case OperatorEnum.LESS_THAN:
                return dayjs(itemValue).isBefore(dayjs(value as string));
            case OperatorEnum.LESS_THAN_OR_EQUAL:
                return dayjs(itemValue).isBefore(dayjs(value as string)) || formatValue === formatItemValue;
            case OperatorEnum.GREATER_THAN:
                return dayjs(itemValue).isAfter(dayjs(value as string));
            case OperatorEnum.GREATER_THAN_OR_EQUAL:
                return dayjs(itemValue).isAfter(dayjs(value as string)) || formatValue === formatItemValue;
            default:
                return true;
        }
    }

    const matchItemValue = (item: Record<string, any>, condition: ConditionType) => {
        const { columnId, operator, value } = condition;
        const column = schema?.columns.find(column => column.id === columnId);
        if (!columnId || !operator || !column) return true;

        const itemValue = item[columnId];

        if (column.type === ColumnTypeEnum.DATE) {
            return matchDateValue(item, condition);
        }

        switch(operator) {
            case OperatorEnum.IS_NULL:
                return isNil(itemValue);
            case OperatorEnum.IS_NOT_NULL:
                return !isNil(itemValue);
            case OperatorEnum.EQUAL:
                return isEqual(itemValue, value);
            case OperatorEnum.NOT_EQUAL:
                return !isEqual(itemValue, value);
            case OperatorEnum.LESS_THAN:
                return Number(itemValue) < Number(value);
            case OperatorEnum.LESS_THAN_OR_EQUAL:
                return Number(itemValue) <= Number(value);
            case OperatorEnum.GREATER_THAN:
                return Number(itemValue) > Number(value);
            case OperatorEnum.GREATER_THAN_OR_EQUAL:
                return Number(itemValue) >= Number(value);
            case OperatorEnum.LIKE:
                return String(itemValue).includes(String(value));
            case OperatorEnum.NOT_LIKE:
                return !String(itemValue).includes(String(value));
            default:
                return true;
        }
    }

    const filter = (item: Record<string, any>) => {
        const view = schema?.views.find(view => view.id === schema?.viewId);
        const filter = view?.filter;
        if (!filter) return true;

        const matches = filter.matches;
        const conditions = filter.conditions?.filter(condition => {
            const { columnId, operator, value } = condition;
            if (!columnId || !operator) return false;

            if ([OperatorEnum.IS_NULL, OperatorEnum.IS_NOT_NULL].includes(operator)) {
                return true;
            } else {
                if (isNil(value)) {
                    return false;
                } else if (isObject(value)) {
                    return !isEmpty(value);
                } else if (isArray(value)) {
                    return !!value.length;
                } else {
                    // number, string
                    return !!`${value}`.trim().length;
                }
            }
        });

        if (matches === FilterMatchEnum.AND) {
            return conditions?.every(condition => matchItemValue(item, condition));
        } else if (matches === FilterMatchEnum.OR) {
            return conditions?.some(condition => matchItemValue(item, condition));
        }
    };
    
    return {
        filter,
    };
}