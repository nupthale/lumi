<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import dayjs from 'dayjs';

import { ColumnType, ColumnTypeEnum, DateColumnType, NumberColumnType, NumberFormatEnum, CurrencyColumnType, SelectColumnType, ImageColumnType, FileType } from '@collection/interface';

import TextField from './TextField.vue';
import NumberField from './NumberField.vue';
import DateField from './DateField.vue';
import SelectField from './SelectField.vue';
import ImageField from './ImageField.vue';

export default defineComponent({
    props: {
        rowId: String,
        column: Object as PropType<ColumnType>,
        value: {
            type: [String, Number, Boolean, Array, Object],
        },
        showPlaceholder: Boolean,
        autofocus: Boolean,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const renderValue = () => {
            if (!props.column) return '';

            switch(props.column.type) {
                case ColumnTypeEnum.TEXT:
                    return (<TextField showPlaceholder={props.showPlaceholder} autofocus={props.autofocus} value={props.value} column={props.column} onChange={(text) => emit('change', text)}></TextField>);

                case ColumnTypeEnum.NUMBER:
                case ColumnTypeEnum.CURRENCY:    
                    return (<NumberField showPlaceholder={props.showPlaceholder} autofocus={props.autofocus} value={props.value} column={props.column} onChange={(text) => emit('change', text)} />)

                case ColumnTypeEnum.DATE:
                    return (<DateField showPlaceholder={props.showPlaceholder} value={props.value as string} column={props.column as DateColumnType} onChange={(text) => emit('change', text)} />);

                case ColumnTypeEnum.SELECT:
                    return (<SelectField showPlaceholder={props.showPlaceholder} value={props.value as string[]} column={props.column as SelectColumnType} onChange={(text) => emit('change', text)} />);

                case ColumnTypeEnum.IMAGE:
                    return (<ImageField showPlaceholder={props.showPlaceholder} rowId={props.rowId} value={props.value as FileType[]} column={props.column as ColumnType & ImageColumnType} />)        

                default:    
                    return 'unknown column type';
            }
        }

        return () => renderValue();
    }
})
</script>

<style scoped>
</style>