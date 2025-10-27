import { ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { defineStore } from 'pinia';

export const useJournalsStore = defineStore('journals', () => {    
    // state
    const yearMonth = ref(dayjs());
    const crtDate = ref();

    const crtFileId = ref();

    // actions
    const setYearMonth = (date: Dayjs) => {
        yearMonth.value = date;
    };

    const setCrtDate = (date: Dayjs) => {
        crtDate.value = date;
    };

    const setCrtFileId = (fileId: string) => {
        crtFileId.value = fileId;
    };

    return {
        yearMonth,
        setYearMonth,

        crtDate,
        setCrtDate,

        crtFileId,
        setCrtFileId,
    };
});