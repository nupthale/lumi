export interface ColumnConfigType {
    id: string,
    hidden: boolean,
}

export interface OrderType {
    columnId: string;
    order: 'asc' | 'desc';
}

export enum OperatorEnum {
    EQUAL = '=',
    NOT_EQUAL = '!=',
    LESS_THAN = '<',
    LESS_THAN_OR_EQUAL = '<=',
    GREATER_THAN = '>',
    GREATER_THAN_OR_EQUAL = '>=',
    LIKE = 'like',
    NOT_LIKE = 'not like',
    IS_NULL = 'is null',
    IS_NOT_NULL = 'is not null',
}

export enum FilterMatchEnum {
    AND = 'and',
    OR = 'or',
}

export type FilterType = {
    conditions: ConditionType[];
    matches: FilterMatchEnum;
};

export type ConditionType = {
    columnId: string;
    operator?: OperatorEnum;
    value?: number | string | string[];
};

export type ViewCardConfigType = {
    coverColumnId?: string;
    titleColumnId?: string;
    tagColumnId?: string;
}

export interface ViewType {
    id: string;
    name: string;
    type: ViewEnum;
    // 每个视图下面的配置可以不同
    columnsConfig: ColumnConfigType[];
    cardConfig: ViewCardConfigType;

    // 只允许选一个
    groupBy?: {
        columnId: string;
    };
    filter?: FilterType;
    orders?: OrderType[];
    fixed?: {
        left?: number;
        right?: number;
    };
}

export interface CollectionSchemaType {
    // 当前默认视图
    viewId: string;
    // 视图列表
    views: ViewType[];
    columns: ColumnType[];
}

export enum ColumnTypeEnum {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    SELECT = 'select',
    CURRENCY = 'currency',
    IMAGE = 'image',
}

export type ColumnTypeValue = ColumnTypeEnum.TEXT | ColumnTypeEnum.NUMBER | ColumnTypeEnum.DATE | ColumnTypeEnum.SELECT | ColumnTypeEnum.CURRENCY | ColumnTypeEnum.IMAGE;

export enum NumberFormatEnum {
    INT = 'int',
    PERCENT = 'percent',
    FLOAT = 'float',
}

export enum CurrencyEnum {
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    AED = 'AED',
    AUD = 'AUD',
    BRL = 'BRL',
    CAD = 'CAD',
    CHF = 'CHF',
    HKD = 'HKD',
    INR = 'INR',
    JPY = 'JPY',
    KRW = 'KRW',
    MXN = 'MXN',
    SGD = 'SGD',
    TWD = 'TWD',
    VND = 'VND',
}

export type TextColumnType = {
    type: ColumnTypeEnum.TEXT;
    config: {};
}

export type DateColumnType = {
    type: ColumnTypeEnum.DATE;
    config: {
        format?: string;
    },
}

export type NumberColumnType = {
    type: ColumnTypeEnum.NUMBER;
    config: {
        format?: NumberFormatEnum;
        precision?: number;
        // 千分位展示
        digitGroup?: boolean;
    };
}

export interface FileType {
    id: string;
    url: string;
    name: string;
    uploading: boolean;
}

export type ImageColumnType = {
    type: ColumnTypeEnum.IMAGE;
    config: {};
}

export type CurrencyColumnType = {
    type: ColumnTypeEnum.CURRENCY;
    config: {
        format?: NumberFormatEnum;
        precision?: number;
        currency: CurrencyEnum;
    };
}

export type SelectOptionType = {
    color: string;
    label: string;
    value: string;
};

export type SelectColumnType = {
    type: ColumnTypeEnum.SELECT;
    config: {
        options: SelectOptionType[];
        multiple?: boolean;
    }
}

export type ColumnType = {
    id: string;
    title: string;
    width: number;
} & (
    TextColumnType | 
    NumberColumnType | 
    DateColumnType |
    SelectColumnType |
    CurrencyColumnType |
    ImageColumnType
);

export enum ViewEnum {
    // 表格视图
    GRID = 'grid',
    // 看板视图
    BOARD = 'board',
    // 图表视图 - 暂不支持
    // CHART = 'chart',
    // 甘特视图 - 暂不支持
    // GANTT = 'gantt',
    // gallery
    GALLERY= 'gallery',
}