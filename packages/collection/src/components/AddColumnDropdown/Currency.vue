<script lang="tsx">
import { defineComponent, inject } from 'vue';
import type { Ref } from 'vue';
import { set } from 'lodash-es';
import { Form, Select, InputNumber } from 'ant-design-vue';

import { i18next } from '@collection/i18next';
import { CurrencyColumnType, CurrencyEnum } from '@collection/interface';

import { currencyList, getCurrencySign } from '@collection/shared/currency';

const FormItem = Form.Item;

export default defineComponent({
    setup() {
        const formModel = inject<Ref<CurrencyColumnType>>('formModel')!;

        return () => (
            <div>
                 <div class="mt-3">
                    <div class="mb-1">{i18next.t('collection.config.currency.title')}</div>
                    <FormItem label={i18next.t('collection.config.currency.title')} name="currency" noStyle  autoLink={false}>
                        <Select 
                            placeholder={i18next.t('collection.config.currency.placeholder')}
                            value={formModel.value?.config?.currency} 
                            onSelect={(val: string) => set(formModel.value, 'config.currency', val as CurrencyEnum)}
                        >
                            {
                                currencyList.map(item => (
                                    <Select.Option value={item}>
                                        <div class="flex items-center justify-between">
                                            <div>{item}</div>

                                            <div class="lightText">
                                                {getCurrencySign(item)}
                                            </div>
                                        </div>
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </FormItem>
                 </div>
            </div>
        );
    }
});
</script>