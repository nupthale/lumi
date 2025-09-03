<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { Form, DatePicker } from 'ant-design-vue';

import DateField from '@collection/components/Field/fields/DateField.vue';
import { CollectionSchemaType, ConditionType, DateColumnType, OperatorEnum } from '@collection/interface';

const FormItem = Form.Item;

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        item: {
            type: Object as PropType<Partial<ConditionType>>,
            required: true,
        },
        column: Object as PropType<DateColumnType>,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const renderValueField = () => {
            const operator = props.item.operator;

            if (!operator) return '';

            switch(operator) {
                case OperatorEnum.EQUAL:
                case OperatorEnum.NOT_EQUAL:
                case OperatorEnum.LESS_THAN:
                case OperatorEnum.LESS_THAN_OR_EQUAL:
                case OperatorEnum.GREATER_THAN:
                case OperatorEnum.GREATER_THAN_OR_EQUAL:
                    return (
                        <FormItem class="customDate flex-1 !border-r-0">
                            <DateField
                                style="width: 100%"
                                showPlaceholder
                                column={props.column}
                                value={props.item.value as string}
                                onChange={(val) => emit('change', val)}
                            />
                        </FormItem>
                    );
                case OperatorEnum.IS_NULL:
                case OperatorEnum.IS_NOT_NULL:
                    return '';
                default:
                    return '';    
            }
        }

        return () => renderValueField()
    }
});
</script>

<style scoped>
.customDate :deep(.dateField) {
    padding: 0 12px!important;
}
</style>