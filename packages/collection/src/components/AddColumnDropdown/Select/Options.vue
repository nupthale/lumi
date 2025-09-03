<script lang="tsx">
import { defineComponent, inject, PropType } from 'vue';
import type { Ref } from 'vue';
import { set } from 'lodash-es';
import { nanoid } from 'nanoid';
import { TextButton } from '@zsfe/zsui';
import { Form, Input } from 'ant-design-vue';
import { Trash2, Plus } from 'lucide-vue-next';

import { i18next } from '@collection/i18next';
import { SelectOptionType } from '@collection/interface';

import { currencyList, getCurrencySign } from '@collection/shared/currency';
import { themeTokens } from '@collection/shared/theme';

import { colors } from './color';
import OptionColor from './OptionColor.vue';

export default defineComponent({
    props: {
        value: Array as PropType<SelectOptionType[]>
    },
    emits: ['change'],
    setup(props, { emit }) {
        const handleAdd = () => {
            emit('change', [
                ...(props.value || []),
                {
                    label: '',
                    value: nanoid(8),
                    // 从0开始到colors?.length - 1
                    color: colors[((props.value?.length || 0) % colors.length)],
                },
            ]);
        }

        const handleUpdate = (index: number, key: keyof SelectOptionType, val: string) => {
            const newValues = [
                ...(props.value || [])
            ];

            newValues[index][key] = val;

            emit('change', newValues);
        }

        const handleDelete = (index: number) => {
            const newValues = [
                ...(props.value || [])
            ];
            newValues.splice(index, 1);
            emit('change', newValues);
        }

        return () => (
            <div class="container">
                {
                    props.value?.map((item, index) => (
                        <div class="flex items-center mb-2">
                            <div>
                                <OptionColor item={item} onChange={(color: string) => handleUpdate(index, 'color', color)} />
                            </div>
                            <Input 
                                placeholder={i18next.t('collection.config.select.placeholder')}
                                value={item.label}
                                onChange={(e) => handleUpdate(index, 'label', e.target.value || '')}
                            />
                            <TextButton class="ml-1" onClick={() => handleDelete(index)}>
                                <Trash2 width={14} height={14} color={themeTokens.lightTextColor()} />
                            </TextButton>
                        </div>
                    ))
                }

                <div class="">
                    <TextButton size="small" type="primary" onClick={handleAdd}>
                        <div class="flex items-center gap-1">
                            <Plus width={14} height={14} />
                            {i18next.t('collection.config.select.addOption')}
                        </div>
                    </TextButton>
                </div>
            </div>
        );
    }
});
</script>

<style scoped>
.container {
    border: 1px solid var(--float-border-color);
    border-radius: 6px;
    padding: 12px 2px 8px 8px;
}
</style>