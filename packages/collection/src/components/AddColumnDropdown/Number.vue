<script lang="tsx">
import { defineComponent, inject } from 'vue';
import type { Ref } from 'vue';
import { Form, Select, InputNumber, Checkbox } from 'ant-design-vue';
import { set } from 'lodash-es';

import { i18next } from '@collection/i18next';
import { NumberColumnType, NumberFormatEnum } from '@collection/interface';

const FormItem = Form.Item;

export default defineComponent({
    setup() {
        const formModel = inject<Ref<NumberColumnType>>('formModel')!;

        return () => (
            <div>
                 <div class="mt-3 mb-3">
                    <div class="mb-1">{i18next.t('collection.config.number.formatTitle')}</div>
                    <FormItem label={i18next.t('collection.config.number.formatTitle')} name="title" noStyle autoLink={false}>
                        <Select 
                            placeholder={i18next.t('collection.config.number.formatPlaceholder')}
                            value={formModel.value?.config?.format} 
                            onSelect={(val: string) => set(formModel.value, 'config.format', val as NumberFormatEnum)}
                        >
                            <Select.Option value={NumberFormatEnum.INT}>{i18next.t('collection.config.number.formatInt')}</Select.Option>
                            <Select.Option value={NumberFormatEnum.FLOAT}>{i18next.t('collection.config.number.formatFloat')}</Select.Option>
                            <Select.Option value={NumberFormatEnum.PERCENT}>{i18next.t('collection.config.number.formatPercent')}</Select.Option>
                        </Select>
                    </FormItem>
                 </div>

                <div class="mb-1">{i18next.t('collection.config.number.precisionTitle')}</div>
                <FormItem label={i18next.t('collection.config.number.precisionTitle')} name="title" class="mb-3" noStyle autoLink={false}>
                    <InputNumber 
                        style="width: 100%;"
                        placeholder={i18next.t('collection.config.number.precisionPlaceholder')}
                        max={4}
                        min={0}
                        step={1}
                        value={formModel.value?.config?.precision} 
                        onChange={val => set(formModel.value, 'config.precision', val as number)}
                    ></InputNumber>
                </FormItem>

                <div class="inline-flex items-center mt-2 select-none cursor-pointer text-xs" onClick={() => set(formModel.value, 'config.digitGroup', !formModel.value?.config.digitGroup)}>
                    <Checkbox 
                        class="mr-1"
                        checked={formModel.value?.config.digitGroup}
                    /> {i18next.t('collection.config.number.digitGroup')}
                </div>
            </div>
        );
    }
});
</script>