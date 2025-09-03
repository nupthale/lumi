<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { Form, Select } from 'ant-design-vue';

import { CollectionSchemaType, ConditionType, OperatorEnum, SelectColumnType, SelectOptionType } from '@collection/interface';

import SelectField from '@collection/components/Field/fields/SelectField.vue';

const FormItem = Form.Item;

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        item: {
            type: Object as PropType<Partial<ConditionType>>,
            required: true,
        },
        column: Object as PropType<SelectColumnType>,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const handleChange = (val: string[]) => {
            emit('change', val);
        }


        const renderValueField = () => {
            const operator = props.item.operator;

            if (!operator) return '';

            switch(operator) {
                case OperatorEnum.EQUAL:
                case OperatorEnum.NOT_EQUAL:
                case OperatorEnum.LIKE:
                case OperatorEnum.NOT_LIKE:
                    return (
                        <FormItem class="customSelect flex-1 !border-r-0">
                            <SelectField
                                showPlaceholder
                                customOpen
                                column={props.column}
                                value={props.item.value as string[]}
                                onChange={handleChange}
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
.customSelect :deep(.selectField) {
    padding: 0 12px;
}
</style>