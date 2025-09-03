<script lang="tsx">
import { defineComponent, PropType } from 'vue';

import FieldValue from '@collection/components/FieldValue/index.vue';

import FieldEdit from './fields/index.vue';

import { ColumnType } from '@collection/interface';

/**
 * cell有两种状态
 * 编辑态： 整个表格只有一个单元格是编辑态
 * 展示态： 默认全部展示态
 */
export default defineComponent({
    props: {
        rowId: String,
        isEditing: Boolean,
        column: Object as PropType<ColumnType>,
        value: {
            type: [String, Number, Boolean, Array, Object],
        },
        showPlaceholder: Boolean,
        autofocus: Boolean,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const renderEditing = () => {
            return (
                <FieldEdit autofocus={props.autofocus} showPlaceholder={props.showPlaceholder} rowId={props.rowId} value={props.value} column={props.column} onChange={(newVal) => emit('change', newVal)} />
            );
        }

        const renderDefault = () => {
            return (
                <FieldValue value={props.value} column={props.column} />
            )
        }

        return () => props.isEditing ? renderEditing() : renderDefault();
    }
})
</script>