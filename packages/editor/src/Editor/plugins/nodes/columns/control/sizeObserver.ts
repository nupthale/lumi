import { columnsSizeChange$ } from './event';

export class SizeObserver {
    private observer: ResizeObserver | null = null;
    
    public dom: HTMLTableElement | null = null;

    constructor(public id: string) {
    }

    resizeHandler() {
        const columns = this.dom;

        if (!columns) return;

        columnsSizeChange$.next({ id: this.id });
    }

    observe = (columns) => {
        this.dom = columns;

        if (!columns) return;

        // 监听dom的高度变化
        this.observer = new ResizeObserver(() => {
            this.resizeHandler();
        });

        // 需要添加这一行来开始观察
        this.observer.observe(columns);
    }

    destroy(): void {
        this.observer?.disconnect();
    }
}