import { ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { defineStore } from 'pinia';

export const useJournalsStore = defineStore('journals', () => {    
    // state
    const yearMonth = ref(dayjs());
    const crtDate = ref(dayjs());

    // actions
    const setYearMonth = (date: Dayjs) => {
        yearMonth.value = date;
    };

    const setCrtDate = (date: Dayjs) => {
        crtDate.value = date;
    };

    return {
        yearMonth,
        setYearMonth,

        crtDate,
        setCrtDate,
    };
});