<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DatePicker, TimePicker } from 'ant-design-vue';
import dayjs from 'dayjs';

import { i18next } from '@collection/i18next';

import { ColumnType, DateColumnType } from '@collection/interface';
import { dateTimeFormats, timeFormats } from '@collection/shared/date';


export default defineComponent({
    props: {
        column: Object as PropType<DateColumnType>,
        value: {
            type: [String, Object],
        },
        showPlaceholder: Boolean,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const renderPicker = () => {
            const format = props.column?.config?.format;

            if (dateTimeFormats.includes(format!)) {
                return (
                    <DatePicker
                        placeholder={props.showPlaceholder ? i18next.t('common.selectPlaceholder') : ''}
                        class="dateField"
                        showTime={true}
                        value={props.value ? dayjs(props.value as string) : undefined}
                        onUpdate:value={val => emit('change', val?.toString())}
                    />
                )
            } else if (timeFormats.includes(format!)) {
                return (
                    <TimePicker
                        placeholder={props.showPlaceholder ? i18next.t('common.selectPlaceholder') : ''}
                        class="dateField"
                        value={props.value ? dayjs(props.value as string) : undefined}
                        onUpdate:value={val => emit('change', val?.toString())}
                     />
                );
            }

            return (
                <DatePicker
                    placeholder={props.showPlaceholder ? i18next.t('common.selectPlaceholder') : ''}
                    class="dateField"
                    value={props.value ? dayjs(props.value as string) : undefined}
                    onUpdate:value={val => emit('change', val?.toString())}
                />
            );
        }

        return () => (
            <div class="w-full">
                {renderPicker()}
            </div>
        );
    }
})
</script>

<style scoped>
.dateField {
    width: 100%;
    border: none!important;
    background: none;
    outline: none!important;
    padding: 0!important;
    box-shadow: none!important;
}
</style>