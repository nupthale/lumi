<script lang="tsx">
import { defineComponent, ref, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import i18next from 'i18next';
import { TextButton } from '@zsfe/zsui';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useElementSize } from '@vueuse/core';

import { FileSchema } from '@/database/schema/file';

import CalendarSelect from '../../components/CalendarSelect.vue';

export default defineComponent({
  props: {
    journals: Object as PropType<FileSchema[]>,
  },  
  emits: ['selectDate'],
  setup(props, { emit }) {
    const yearMonth = ref(dayjs());
    const crtDate = ref(dayjs());

    const daysContainerRef = ref<HTMLDivElement>();
    const daysWrapRef = ref<HTMLDivElement>();

    const docTitles = computed(() => props.journals?.map(item => item.title));

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
        crtDate.value = date;
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
                <CalendarSelect value={yearMonth.value} onUpdate={val => yearMonth.value = val} />
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
                                    <div class={['statusBar', docTitles.value?.includes(day.format('YYYYMMDD')) ? 'hasDoc' : '']}></div>
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
    width: 20px;
    height: 4px;
    border-radius: 4px;
   
}

.statusBar.hasDoc {
    background: #56d364; 
}
</style>