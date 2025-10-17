<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { PropType } from 'vue';
import { DatePicker } from 'ant-design-vue';
import { onClickOutside } from '@vueuse/core'
import { TextButton } from '@zsfe/zsui';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarDays } from 'lucide-vue-next';

import { formatYearMonth } from '@/shared/date';

const containerRef = ref();

const dateDropdownOpen = ref(false);

const props = defineProps({
    value: {
        type: Object as PropType<Dayjs>,
        default: dayjs()
    }
});

const emit = defineEmits(['update']);

onClickOutside(containerRef, () => {
    dateDropdownOpen.value = false;
});

const handleToggle = () => {
    dateDropdownOpen.value = !dateDropdownOpen.value;
}

const handleChange = (value: Dayjs) => {
    emit('update', value);

    dateDropdownOpen.value = false;
}

const getPopupContainer = () => containerRef.value;
</script>

<template>
    <div ref="containerRef" class="header-calendar" >
        <TextButton class="header-calendarBtn" @click="handleToggle">
            <CalendarDays width="16" />
            <span>{{ formatYearMonth(props.value) }}</span>
            <DatePicker v-if="dateDropdownOpen" class="header-calendar-picker" :bordered="false" picker="month" :open="dateDropdownOpen" :getPopupContainer="getPopupContainer" @change="handleChange"  />
        </TextButton>
    </div>
</template>

<style>
.header-calendar .ant-picker-input input {
    cursor: pointer !important;
}
</style>

<style scoped lang="less">
.header-calendar {
    position: relative;
    margin-left: -6px;

    .header-calendarBtn {
        display: flex;
        align-items: center;
        gap: 8px;

        font: 500 16px/30px 'DINPro-Medium';
    }

    .header-calendar-picker {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
}

.header-calendar-picker :deep(.ant-picker-cell .ant-picker-cell-inner) {
    display: inline-flex;
    width: 88px;
    height: 60px;
    align-items: center;
    justify-content: center;
}
</style>