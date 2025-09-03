import { debounce } from 'lodash-es';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ColumnsControl } from '../index';

import { commentsVisibleChange$ } from '@editor/Editor/event';

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
        const columnsWrap = this.columnsControl.columnsWrap;
        if (!columnsWrap) return 0;

        const columnsWrapWidth = columnsWrap.clientWidth;
        return columnsWrapWidth - this.containerWidth;
    }


    constructor(private columnsControl: ColumnsControl) {
    }

    update = () => {
        this.updateScrollable();
        this.updateColumnsSliderWidth();
    }

    updateColumnsSliderWidth = () => {
        const columnsWrap = this.columnsControl.columnsWrap;
        const columnsScrollbar = this.columnsControl.columnsScrollbar;
        const columnsSlider = this.columnsControl.columnsSlider;

        if (!columnsWrap || !columnsScrollbar || !this.scrollable) return;
        
        const columnsWrapWidth = columnsWrap.clientWidth;

        const MIN_SLIDER_WIDTH = 40;

        const newWidth = Math.max(MIN_SLIDER_WIDTH, this.containerWidth * (this.containerWidth / columnsWrapWidth));

        columnsSlider.style.width = `${newWidth}px`;
    }

    updateScrollable = () => {
        const columnsWrap = this.columnsControl.columnsWrap;
        const columnsSlider = this.columnsControl.columnsSlider;
        const columnsScrollbar = this.columnsControl.columnsScrollbar;

        // 如果columnsWrap的宽度大于820px + calc((820px - 77vw) * 0.3)， 则开始滚动
        const columnsWrapWidth = columnsWrap?.clientWidth || 0;

        this.scrollable = columnsWrapWidth > this.containerWidth;

        if (this.scrollable) {
            columnsScrollbar?.classList.remove('hidden');

            this.updateColumnsSliderWidth();
        } else {
            columnsScrollbar?.classList.add('hidden');

            // 从可滚动变回不可滚动时， 要重置状态
            if (columnsSlider) {
                columnsSlider.style.transform = `translateX(0px) translateZ(0px)`;
            }
           
            if (columnsWrap) {
                columnsWrap.style.transform = `translateX(0px)`;
            }
        }

        this.updateClip();
    }

    init = () => {
        this.observe();
        this.initEvt();

        this.updateShadow();
        this.updateClip();
    }

    observe = () => {
        if (!this.columnsControl.columnsWrap) return;

        const debouncedUpdate = debounce(this.updateScrollable, 200);

        this.resizeObserver = new ResizeObserver(() => {
            debouncedUpdate();
        });

        this.resizeObserver.observe(this.columnsControl.columnsWrap!);
    }

    scrollByX = (deltaX: number) => {
        const columnsSlider = this.columnsControl.columnsSlider;
        const columnsWrap = this.columnsControl.columnsWrap;

        this.scrollLeft = Math.max(0, Math.min(this.scrollLeft + deltaX, this.maxScrollLeft));
        
        const maxX = this.containerWidth - columnsSlider.clientWidth;

        columnsSlider.style.transform = `translateX(${(this.scrollLeft / this.maxScrollLeft) * (maxX) - 12}px)`;

        columnsWrap.style.transform = `translateX(${-this.scrollLeft}px)`;

        this.updateShadow();
        this.updateClip();
    }

    updateClip = () => {
        const columnsComponentInner = this.columnsControl.columnsComponentInner;
        if (!columnsComponentInner) return;

        if (this.scrollable) {
            if (this.scrollLeft < this.maxScrollLeft) {
                const clipRight = this.commentsVisible ? 0 : '-200px';

                columnsComponentInner.style.clipPath = `inset(-500px ${clipRight} -500px -50px)`;
            } else {
                columnsComponentInner.style.clipPath = 'inset(-500px -200px -500px -50px)';
            }  
        }
    }

    updateShadow = () => {
        const columnsComponent = this.columnsControl.columnsComponent;

        if (!columnsComponent || !this.scrollable) return;

        columnsComponent?.classList.remove('end');

        if (this.scrollLeft < this.maxScrollLeft && !columnsComponent.classList.contains('end')) {
            columnsComponent?.classList.add('end');
        }
    }

    handleWheel = (e: Event) => {
        const colTarget = (e.target as HTMLElement).closest('.doc-columns-component');

        if (!colTarget || !this.columnsControl.columnsScrollbar || !this.scrollable) return;

        // 如果纵向滚动delta > 横向的， 也不处理
        if (Math.abs((e as WheelEvent).deltaY) >= Math.abs((e as WheelEvent).deltaX)) return;

        this.scrollByX((e as WheelEvent).deltaX);
    }

    handleMouseDown = (e) => {
        const slider = (e.target as HTMLElement).closest('.doc-columns-slider');

        if (!slider) return;

        const columnsScrollbar = this.columnsControl.columnsScrollbar;

        if (
            this.scrolling ||
            !columnsScrollbar ||
            columnsScrollbar.classList.contains('active')
        ) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        this.scrolling = true;
        this.startScrollX = e.clientX;

        this.columnsControl.columnsScrollbar?.classList.add('active');
    }

    handleMouseMove = (e: MouseEvent) => {
        if (!this.scrolling) return;

        this.scrollByX(e.clientX - this.startScrollX);
        this.startScrollX = e.clientX;
    }

    handleMouseUp = () => {
        this.scrolling = false;
        this.startScrollX = 0;

        const columnsScrollbar = this.columnsControl.columnsScrollbar;
        if (columnsScrollbar) {
            columnsScrollbar.classList.remove('active');
        }
    }

    initEvt = () => {
        const container = this.columnsControl.columnsComponent;

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
        const container = this.columnsControl.columnsComponent;

        container?.removeEventListener('wheel', this.handleWheel);

        container?.removeEventListener('mousedown', this.handleMouseDown, true);
        document?.removeEventListener('mousemove', this.handleMouseMove, true);
        document?.removeEventListener('mouseup', this.handleMouseUp, true);

        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}