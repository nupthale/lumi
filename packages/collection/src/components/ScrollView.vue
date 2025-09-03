<script lang="tsx">
import { defineComponent, provide, ref } from 'vue';
import { useEventListener, useElementSize, useResizeObserver } from '@vueuse/core';

export default defineComponent({
    props: {
        contentClass: String,
    },
    setup(props, { slots }) {
        const scrollable = ref(false);

        const scrollLeft = ref(0);

        const scrolling = ref(false);

        const startScrollX = ref(0);

        provide('scrollLeft', scrollLeft);

        const scrollBarRef = ref<HTMLDivElement>();
        const sliderRef = ref<HTMLDivElement>();

        const containerRef = ref<HTMLDivElement>();
        const contentRef = ref<HTMLDivElement>();

        const { width: containerWidth } = useElementSize(containerRef);

        const getMaxScrollLeft = () => {
            const content = contentRef.value;
            if (!content) return 0;

            const contentTotalWidth = content.clientWidth;
            return contentTotalWidth - containerWidth.value;
        };

        const updateTableSliderWidth = () => {
            const content = contentRef.value;
            const slider = sliderRef.value;
            const scrollbar = scrollBarRef.value;

            if (!content || !scrollbar || !scrollable.value || !slider) return;
            
            const contentWidth = content.clientWidth;

            const MIN_SLIDER_WIDTH = 40;

            const newWidth = Math.max(MIN_SLIDER_WIDTH, containerWidth.value * (containerWidth.value / contentWidth));

            slider.style.width = `${newWidth}px`;
        }

        const updateScrollable = () => {
            const content = contentRef.value;
            const slider = sliderRef.value;
            const scrollbar = scrollBarRef.value;

            // 如果tableWrap的宽度大于820px + calc((820px - 77vw) * 0.3)， 则开始滚动
            const contentWidth = content?.clientWidth || 0;

            scrollable.value = contentWidth > containerWidth.value;

            if (scrollable.value) {
                scrollbar?.classList.remove('hidden');

                updateTableSliderWidth();
            } else {
                scrollbar?.classList.add('hidden');

                // 从可滚动变回不可滚动时， 要重置状态
                if (slider) {
                    slider.style.transform = `translateX(0px) translateZ(0px)`;
                }
            
                if (content) {
                    content.style.transform = `translateX(0px)`;
                }
            }
        }

        useResizeObserver(contentRef, () => {
            updateScrollable();
        }); 

        useResizeObserver(containerRef, () => {
            updateScrollable();
        }); 

        const handleMouseDown = (e: MouseEvent) => {
            const slider = (e.target as HTMLElement).closest('.scrollView-slider');

            if (!slider) return;

            if (
                scrolling.value ||
                !scrollBarRef.value ||
                scrollBarRef.value.classList.contains('active')
            ) return;

            e.stopImmediatePropagation();
            e.preventDefault();

            scrolling.value = true;
            startScrollX.value = e.clientX;

            scrollBarRef.value.classList.add('active');
        };

        const scrollByX = (e: MouseEvent, deltaX: number) => {
            const tableSlider = sliderRef.value;
            const content = contentRef.value;
            const maxScrollLeft = getMaxScrollLeft();

            if (!content || !tableSlider) return;

            scrollLeft.value = Math.max(0, Math.min(scrollLeft.value + deltaX, maxScrollLeft));
            
            const maxX = containerWidth.value - tableSlider.clientWidth;

            tableSlider.style.transform = `translateX(${(scrollLeft.value / maxScrollLeft) * (maxX) - 12}px)`;

            content.style.transform = `translateX(${-scrollLeft.value}px)`;
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!scrolling.value) return;

            scrollByX(e, e.clientX - startScrollX.value);
            startScrollX.value = e.clientX;
        };

        const handleMouseUp = () => {
            scrolling.value = false;
            startScrollX.value = 0;

            const scrollBar = scrollBarRef.value;
            if (scrollBar) {
                scrollBar.classList.remove('active');
            }
        };

        const handleWheel = (e: WheelEvent) => {
            const container = (e.target as HTMLElement).closest('.scrollView');

            if (!container || !scrollBarRef.value || !scrollable.value) return;

            // 如果纵向滚动delta > 横向的， 也不处理
            if (Math.abs((e as WheelEvent).deltaY) >= Math.abs((e as WheelEvent).deltaX)) return;

            scrollByX(e, (e as WheelEvent).deltaX);
        };

        useEventListener(document.body, 'mousedown', handleMouseDown);
        useEventListener(document.body, 'mousemove', handleMouseMove);
        useEventListener(document.body, 'mouseup', handleMouseUp);
        useEventListener(containerRef, 'wheel', handleWheel, {
            passive: true,
            capture: true,
        });

        return () => (
            <div ref={containerRef} class="scrollView">
                <div ref={contentRef} class={`scrollView-content ${props.contentClass}`}>
                    {slots.default?.()}
                </div>
                <div class="scrollView-scrollbar" ref={scrollBarRef}>
                    <div class="scrollView-slider" ref={sliderRef}></div>
                </div>
            </div>
        );
    }
});
</script>

<style scoped>
.scrollView:hover .scrollView-scrollbar {
    opacity: 1;
}

.scrollView-content {
    width: fit-content;
}

.scrollView-scrollbar {
    position: sticky;
    bottom: 14px;
    width: 0;
    height: 0;

    opacity: 0;

    transition: opacity.2s ease;

    &:before {
        content: '';
        display: block;
        height: 4px;
    }

    &.hidden {
        display: none;
    }

    &.active {
        opacity: 1;
    }
}

.scrollView-slider {
    background: var(--scroll-slider-bg);
    height: 8px;
    border-radius: 4px;
    width: 589px;
    cursor: default;
    transform: translateX(0) translateZ(0);

    &:hover, &:active {
        background: var(--scroll-slider-hover-bg);
    }
}
</style>