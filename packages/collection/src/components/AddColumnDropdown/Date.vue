<script lang="tsx">
import { defineComponent, inject } from 'vue';
import type { Ref } from 'vue';
import { Form, Select } from 'ant-design-vue';
import { CalendarDays, Clock } from 'lucide-vue-next';
import { set } from 'lodash-es';

import { i18next } from '@collection/i18next';
import { DateColumnType } from '@collection/interface';

import { dateFormats, dateTimeFormats, timeFormats, formatText } from '@collection/shared/date';

const FormItem = Form.Item;

export default defineComponent({
    setup() {
        const formModel = inject<Ref<DateColumnType>>('formModel')!;

        return () => (
            <div>
                 <div class="mt-3">
                    <div class="mb-1">{i18next.t('collection.config.date.title')}</div>
                    <FormItem label={i18next.t('collection.config.date.title')} name="currency" noStyle  autoLink={false}>
                        <Select 
                            placeholder={i18next.t('collection.config.date.placeholder')}
                            value={formModel.value?.config?.format} 
                            onSelect={(val: string) => set(formModel.value, 'config.format', val as string)}
                        >
                            {
                                dateFormats.map(format => (
                                    <Select.Option key={format} value={format}>
                                        <div class="flex items-center justify-between">
                                            <div>{formatText(format)}</div>
                                            <div class="lightText">
                                                <CalendarDays width={14} height={14} />
                                            </div>
                                        </div>
                                    </Select.Option>
                                ))
                            }
                            {
                                dateTimeFormats.map(format => (
                                    <Select.Option key={format} value={format}>
                                        <div class="flex items-center justify-between">
                                            <div>{formatText(format)}</div>
                                            <div  class="lightText">
                                                <Clock width={14} height={14} />
                                            </div>
                                        </div>
                                    </Select.Option>
                                ))
                            }

                            {
                                timeFormats.map(format => (
                                    <Select.Option key={format} value={format}>
                                        <div class="flex items-center justify-between">
                                            <div>{formatText(format)}</div>
                                            <div  class="lightText">
                                                <Clock width={14} height={14} />
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

<style scoped>
.divider {
    height: 1px;
    background: rgba(31, 35, 41, 0.15);
}
</style>