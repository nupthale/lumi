<script lang="tsx">
import { defineComponent, ref, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import i18next from 'i18next';
import { TextButton } from '@zsfe/zsui';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useElementSize } from '@vueuse/core';

import { FileSchema } from '@/database/schema/file';

import { useContextStore } from '@/store/ui-states/context';
import { useJournalsStore } from '@/store/ui-states/journals/index';
import { useJournalStats } from '@/store/queries/docs/useJournalStats';
import CalendarSelect from '@/components/DateSelect/CalendarSelect.vue';

import { storeToRefs } from 'pinia';

export default defineComponent({
  props: {
    journals: Object as PropType<FileSchema[]>,
  },  
  emits: ['selectDate'],
  setup(props, { emit }) {
    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const journalsStore = useJournalsStore();
    const { yearMonth, crtDate } = storeToRefs(journalsStore);

    const daysContainerRef = ref<HTMLDivElement>();
    const daysWrapRef = ref<HTMLDivElement>();

    const { journalStats } = useJournalStats(crtSpace);

    const getStatusCls = (date: string) => {
        const journal = journalStats.value?.find(item => item._id === date);

        if (!journal) {
            return ``;
        }

        if (!journal.wordsCount && !journal.charCount) {
            if (journal.hasMediaBlock) {
                return 'status-3';
            }
        }

        const count = Math.max(journal.wordsCount, journal.charCount);

        if (count >= 0 && count < 50) {
            return 'status-1';
        } else if (count >= 50 && count < 100) {
            return 'status-2';
        } else if (count >= 100 && count < 200) {
            return 'status-3';
        } else {
            return 'status-4';
        }
    }

    const scrollLeft = ref(0);

    const { width: containerWidth } = useElementSize(daysContainerRef);
    const { width: wrapWidth } = useElementSize(daysWrapRef);

    const isOverflow = computed(() => {
        return wrapWidth.value > containerWidth.value;
    });

    const maxScrollLeft = computed(() => {
        return wrapWidth.value - containerWidth.value;
    });

    const days = computed(() => {
        // 获取yearMonth内的所有日期
        const year = yearMonth.value.year();
        const month = yearMonth.value.month(); // 0-11 (January is 0)
        
        // Get the first day of the month
        const firstDay = dayjs().year(year).month(month).date(1);
        
        // Generate all dates in the month
        const dates = [];
        let currentDate = firstDay.clone();
        
        while (currentDate.isSame(firstDay, 'month')) {
            dates.push(currentDate.clone());
            currentDate = currentDate.add(1, 'day');
        }
        
        return dates;
    });

    const isAtStart = computed(() => {
        return scrollLeft.value === 0;
    });

    const isAtEnd = computed(() => {
        return scrollLeft.value === maxScrollLeft.value;
    });

    const handleScrollLeft = () => {
        scrollLeft.value = Math.max(0, scrollLeft.value - 500);

        if (daysWrapRef.value) {
            daysWrapRef.value.style.transform = 'translateX(-' + scrollLeft.value + 'px)';
        }
    }

    const handleScrollRight = () => {
        scrollLeft.value = Math.min(maxScrollLeft.value, scrollLeft.value + 500);

        if (daysWrapRef.value) {
            daysWrapRef.value.style.transform = 'translateX(-' + scrollLeft.value + 'px)';
        }
    }

    const handleSelectDate = (date: Dayjs) => {
        journalsStore.setCrtDate(date);
        // 如果有文档， 就展示， 没有就创建后展示
        emit('selectDate', date);
    }

    onMounted(() => {
        if (!daysWrapRef.value || !daysContainerRef.value) {
            return;
        }

        const todayItem = daysWrapRef.value?.querySelector('.dayItem.today');
        
        if (!todayItem) {
            return;
        }

        const todayItemBounding = todayItem.getBoundingClientRect();
        const containerBounding = daysContainerRef.value.getBoundingClientRect();
        if (todayItemBounding.left >= containerBounding.left + containerBounding.width) {
            const translateX = todayItemBounding.left + containerBounding.width / 2 - containerBounding.left - containerBounding.width;
            scrollLeft.value = Math.min(translateX, maxScrollLeft.value);
            daysWrapRef.value.style.transform = `translateX(-${scrollLeft.value}px)`;
        }
    });

    return () => (
        <div class="wrap w-full">
            <div class="flex items-center justify-center mb-4">
                <CalendarSelect value={yearMonth.value} onUpdate={val => journalsStore.setYearMonth(val as Dayjs)} />
            </div>
            <div class="days flex items-center relative">
                <div class="overflow-hidden" ref={daysContainerRef}>
                    <div class="flex items-center w-fit daysWrap gap-1" ref={daysWrapRef}>
                        {
                            days.value.map((day, index) => (
                                <div key={index} class={['dayItem', 'flex-1', 'flex-shrink-0', day.isSame(dayjs(), 'day') ? 'today' : '', day.isSame(crtDate.value, 'day') ? 'selected' : '']} onClick={() => handleSelectDate(day)}>
                                    
                                    <div class="dayItemInner flex items-center flex-col">
                                        <div class="date font-semibold text-2xl">{day.format('DD')}</div>
                                        <div class="text-xs mt-.5 font-light">{day.locale(i18next.language).format('ddd')}</div>
                                    </div>
                                    <div class={['statusBar', getStatusCls(day.format('YYYYMMDD'))]}></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    isOverflow.value && !isAtStart.value ? (
                        <div class="pr-2 absolute left-0 top-0 arrowBtnWrap">
                            <TextButton onClick={handleScrollLeft}>
                                <ChevronLeft />
                            </TextButton>
                        </div>
                    ) : ''
                }

                {
                    isOverflow.value && !isAtEnd.value ? (
                        <div class="pl-2 absolute right-0 top-0 arrowBtnWrap">
                            <TextButton onClick={handleScrollRight}>
                                <ChevronRight />
                            </TextButton>
                        </div>
                    ) : ''
                }
            </div>
            
        </div>
    );
  },
});
</script>

<style scoped>
.wrap {
    padding: 18px 4px 18px;
    border-bottom: 1px solid var(--default-border-color);
}

.dayItem {
    min-width: 80px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 0;
    cursor: pointer;
    border-radius: 8px;
    user-select: none;

    font-family: 'DINPro-Medium';
}

.dayItemInner {
    width: 42px;
    padding: 4px 4px 8px;
}

.dayItem.today .dayItemInner {
    background: #FD404E;
    color: #fff;
    border-radius: 6px;
}

.dayItem:hover {
    background: var(--menu-item-hover);
}

.dayItem.selected {
    background: var(--menu-item-hover);
}

.days {
    height: 72px;
}

.arrowBtnWrap {
    display: flex;
    align-items: center;

    height: 72px;
    background: var(--blur-bg);
}

.daysWrap {
    transition: transform 0.3s ease;
}

.statusBar {
    margin-top: 8px;
    width: 8px;
    height: 8px;
    border-radius: 2px;
   
}

.statusBar.status-1 {
    background: var(--graphlevel-1); 
}

.statusBar.status-2 {
    background: var(--graphlevel-2); 
}

.statusBar.status-3 {
    background: var(--graphlevel-3); 
}

.statusBar.status-4 {
    background: var(--graphlevel-4); 
}
</style>