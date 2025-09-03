import { debounce } from 'lodash-es';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { commentsVisibleChange$ } from '@editor/Editor/event';

import { TableControl } from '../table';

import { docScroll$ } from '@editor/Editor/event';

export class ScrollControl {
    private resizeObserver: ResizeObserver | null = null;

    private scrollable = false;

    private scrollLeft = 0;
    
    private scrolling = false;

    private startScrollX = 0;

    private subscriptions: Subscription[] = [];

    private commentsVisible = localStorage.getItem('commentsVisible') === 'false' ? false : true;

    get containerWidth() {
        const documentWidth = document.documentElement.clientWidth || 0;

        if (documentWidth <= 1600) {
            return 820 + (0.6 * documentWidth - 820) * 0.3;
        }

        return 820 + (0.77 * documentWidth - 820) * 0.3;
    }

    get maxScrollLeft() {
        const tableWrap = this.table.tableWrap;
        if (!tableWrap) return 0;

        const tableWrapWidth = tableWrap.clientWidth;
        return tableWrapWidth - this.containerWidth;
    }


    constructor(private table: TableControl) {
    }

    update = () => {
        this.updateScrollable();
        this.updateTableSliderWidth();
    }

    updateTableSliderWidth = () => {
        const tableWrap = this.table.tableWrap;
        const tableScrollbar = this.table.tableScrollbar;
        const tableSlider = this.table.tableSlider;

        if (!tableWrap || !tableScrollbar || !this.scrollable) return;
        
        const tableWrapWidth = tableWrap.clientWidth;

        const MIN_SLIDER_WIDTH = 40;

        const newWidth = Math.max(MIN_SLIDER_WIDTH, this.containerWidth * (this.containerWidth / tableWrapWidth));

        tableSlider.style.width = `${newWidth}px`;
    }

    updateScrollable = () => {
        const tableWrap = this.table.tableWrap;
        const tableSlider = this.table.tableSlider;
        const tableScrollbar = this.table.tableScrollbar;

        // 如果tableWrap的宽度大于820px + calc((820px - 77vw) * 0.3)， 则开始滚动
        const tableWrapWidth = tableWrap?.clientWidth || 0;

        this.scrollable = tableWrapWidth > this.containerWidth;

        if (this.scrollable) {
            tableScrollbar?.classList.remove('hidden');

            this.updateTableSliderWidth();
        } else {
            tableScrollbar?.classList.add('hidden');

            // 从可滚动变回不可滚动时， 要重置状态
            if (tableSlider) {
                tableSlider.style.transform = `translateX(0px) translateZ(0px)`;
            }
           
            if (tableWrap) {
                tableWrap.style.transform = `translateX(0px)`;
            }
        }

        this.updateShadow();
        this.updateClip();
    }

    init = () => {
        this.observe();
        this.initEvt();

        this.updateShadow();
        this.updateClip();
    }

    observe = () => {
        if (!this.table.tableWrap) return;

        const debouncedUpdate = debounce(this.updateScrollable, 200);

        this.resizeObserver = new ResizeObserver(() => {
            debouncedUpdate();
        });

        this.resizeObserver.observe(document.body!);
    }

    scrollByX = (e, deltaX: number) => {
        const tableSlider = this.table.tableSlider;
        const tableWrap = this.table.tableWrap;

        this.scrollLeft = Math.max(0, Math.min(this.scrollLeft + deltaX, this.maxScrollLeft));
        
        const maxX = this.containerWidth - tableSlider.clientWidth;

        tableSlider.style.transform = `translateX(${(this.scrollLeft / this.maxScrollLeft) * (maxX) - 12}px)`;

        tableWrap.style.transform = `translateX(${-this.scrollLeft}px)`;

        this.updateShadow();
        this.updateClip();

        docScroll$.next({
            e,
        });
    }

    updateClip = () => {
        const tableComponentInner = this.table.tableComponentInner;
        if (!tableComponentInner) return;

        if (this.scrollable) {
            if (this.scrollLeft < this.maxScrollLeft) {
                const clipRight = this.commentsVisible ? 0 : '-200px';

                tableComponentInner.style.clipPath = `inset(-500px ${clipRight} -500px -50px)`;
            } else {
                tableComponentInner.style.clipPath = 'inset(-500px -200px -500px -50px)';
            }  
        }
    }

    updateShadow = () => {
        const tableComponent = this.table.tableComponent;

        tableComponent?.classList.remove('end');

        if (!tableComponent || !this.scrollable) return;

        if (this.scrollLeft < this.maxScrollLeft && !tableComponent.classList.contains('end')) {
            tableComponent?.classList.add('end');
        }
    }

    handleWheel = (e: Event) => {
        const colTarget = (e.target as HTMLElement).closest('.doc-table-component');

        if (!colTarget || !this.table.tableScrollbar || !this.scrollable) return;

        // 如果纵向滚动delta > 横向的， 也不处理
        if (Math.abs((e as WheelEvent).deltaY) >= Math.abs((e as WheelEvent).deltaX)) return;

        this.scrollByX(e, (e as WheelEvent).deltaX);
    }

    handleMouseDown = (e) => {
        const slider = (e.target as HTMLElement).closest('.doc-table-slider');

        if (!slider) return;

        const tableScrollbar = this.table.tableScrollbar;

        if (
            this.scrolling ||
            !tableScrollbar ||
            tableScrollbar.classList.contains('active')
        ) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        this.scrolling = true;
        this.startScrollX = e.clientX;

        this.table.tableScrollbar?.classList.add('active');
    }

    handleMouseMove = (e: MouseEvent) => {
        if (!this.scrolling) return;

        this.scrollByX(e, e.clientX - this.startScrollX);
        this.startScrollX = e.clientX;
    }

    handleMouseUp = () => {
        this.scrolling = false;
        this.startScrollX = 0;

        const tableScrollbar = this.table.tableScrollbar;
        if (tableScrollbar) {
            tableScrollbar.classList.remove('active');
        }
    }

    initEvt = () => {
        const container = this.table.tableComponent;

        container?.addEventListener('wheel', this.handleWheel, {
            passive: true,
            capture: true,
        });

        container?.addEventListener('mousedown', this.handleMouseDown, true);
        document?.addEventListener('mousemove', this.handleMouseMove, true);
        document?.addEventListener('mouseup', this.handleMouseUp, true);

        this.subscriptions.push(
            commentsVisibleChange$.pipe(
                tap((visible) => {
                    this.commentsVisible = visible;

                    this.updateClip();
                }),
            ).subscribe()
        );
    }

    destroy = () => {
        const container = this.table.tableComponent;

        container?.removeEventListener('wheel', this.handleWheel);

        container?.removeEventListener('mousedown', this.handleMouseDown, true);
        document?.removeEventListener('mousemove', this.handleMouseMove, true);
        document?.removeEventListener('mouseup', this.handleMouseUp, true);

        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}