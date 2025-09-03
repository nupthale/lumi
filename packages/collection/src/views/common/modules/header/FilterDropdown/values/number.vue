<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { Form, InputNumber } from 'ant-design-vue';

import { CollectionSchemaType, ConditionType, OperatorEnum } from '@collection/interface';
import { i18next } from '@collection/i18next';

const FormItem = Form.Item;

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        item: {
            type: Object as PropType<Partial<ConditionType>>,
            required: true,
        },
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
                        <FormItem class="flex-1 !border-r-0">
                            <InputNumber
                                placeholder={i18next.t('common.placeholder')}
                                value={props.item.value as number}
                                onChange={(val) => emit('change', val)}
                                style="width: 100%"
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