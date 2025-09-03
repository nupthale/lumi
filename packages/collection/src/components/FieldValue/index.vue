<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import dayjs from 'dayjs';
import { isNil, split } from 'lodash-es';

import { ColumnType, ColumnTypeEnum, DateColumnType, NumberColumnType, NumberFormatEnum, CurrencyColumnType, SelectColumnType, ImageColumnType, FileType } from '@collection/interface';

import { getCurrencySign } from '@collection/shared/currency';
import { themeTokens } from '@collection/shared/theme';

export default defineComponent({
    props: {
        column: Object as PropType<ColumnType>,
        value: {
            type: [String, Number, Boolean, Array, Object],
        }
    },
    setup(props) {

        // 千分位展示
        const toDigitGroup = (val: number) => {
            return Number(val).toLocaleString('en-US');
        }

        const renderNumberValue = (column: NumberColumnType | CurrencyColumnType, digitGroup?: boolean) => {
            const isCurrency = column.type === ColumnTypeEnum.CURRENCY;
            var config = column.config;
            var format = config.format;
            const currencySign = isCurrency ? getCurrencySign((column as CurrencyColumnType).config?.currency) : '';

            if (format === NumberFormatEnum.INT) {
                let val: string | number = parseInt(props.value as string);
                val = digitGroup ? toDigitGroup(val) : val;

                return (
                    <div class="w-full text-right">{currencySign}{val}</div>
                );
            } else if (format === NumberFormatEnum.FLOAT) {
                let val: string | number = Number(props.value as string).toFixed(config.precision || 0);
                val = digitGroup ? toDigitGroup(Number(val)) : val;

                return (
                    <div class="w-full text-right">{currencySign}{val}</div>
                )
            } else if (format === NumberFormatEnum.PERCENT) {
                let val: string | number = Number(props.value as string).toFixed(config.precision || 0);
                val = digitGroup ? toDigitGroup(Number(val)) : val;

                return (
                    <div class="w-full text-right">
                        {currencySign}{val}
                        <span class="lightText text-xs ml-1">%</span>
                    </div>    
                );
            }

            return 'unknown number format';
        }

        const renderSelectValue = (column: SelectColumnType) => {
            const value = (props.value || []) as string[];
            const options = column.config?.options;

            const getTextColor = (color: string) => {
                return color[2];
            }

            return (
                <div class="flex items-center flex-wrap gap-1">
                    {
                        options.filter(option => value.includes(option.value)).map(option => (
                            <div class="selectTag" key={option.value} style={{ background: `var(${option.color})`, color: `var(--${getTextColor(option.color)}900)`}}>
                                <span class="selectTag_text">
                                    {option.label}
                                </span>
                            </div>
                        ))
                    }
                </div>
            )
        }

        const renderImageValue = () => {
            const value = (props.value || []) as FileType[];

            return (
                <div class="flex items-center flex-wrap gap-1">
                    {
                        value?.map(image => (
                            <div class="imageThumb" style={{ backgroundImage: !image.uploading ? `url(${image?.url})` : 'none' }}>
                                {
                                    image.uploading ? (
                                        <svg class="animate-spin" style={{ width: '12px', height: '12px', color: themeTokens.primaryTextColor()}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        ''
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            )
        }

        const renderValue = () => {
            if (!props.column || isNil(props.value)) return '';

            const column = props.column;

            switch(props.column.type) {
                case ColumnTypeEnum.TEXT:
                    return (<div class="text-left">{props.value}</div>);
                
                case ColumnTypeEnum.DATE:
                    return (<div class="text-left">{dayjs(props.value as string).format((column as DateColumnType).config?.format as string)}</div>);
                
                case ColumnTypeEnum.NUMBER:
                    return renderNumberValue(column as NumberColumnType, (column as NumberColumnType).config?.digitGroup);

                case ColumnTypeEnum.CURRENCY:
                    return renderNumberValue(column as CurrencyColumnType, true);

                case ColumnTypeEnum.SELECT:
                    return renderSelectValue(column as SelectColumnType);

                case ColumnTypeEnum.IMAGE:
                    return renderImageValue();

                default:    
                    return 'unknown column type';
            }
        }

        return () => renderValue();
    }
})
</script>

<style scoped>
.selectTag {
    font-size: 12px;
    padding: 0 8px;
    border-radius: 12px;
    line-height: 18px;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.imageThumb {
    display: flex; 
    align-items: center;
    justify-content: center;

    width: 30px;
    height: 20px;
    border-radius: 4px;
    background-size: cover;
    cursor: pointer;
    transition: all .1s ease;
    background-color: var(--image-active-bg);
}

.imageThumb:hover {
    transform: scale(1.2);
}
</style>