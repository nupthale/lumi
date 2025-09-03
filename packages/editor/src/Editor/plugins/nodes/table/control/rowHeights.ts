import { tableSizeChange$ } from './event';

export class RowHeights {
    private observer: ResizeObserver | null = null;

    public heights: number[] = [];
    
    public dom: HTMLTableElement | null = null;

    constructor(public tableId: string) {
    }

    resizeHandler() {
        const table = this.dom;

        if (!table) return;

        const rows = table.querySelectorAll('tr');
        const heights: number[] = [];

        rows.forEach(row => {
            const height = row.getBoundingClientRect().height;

            heights.push(height);
        });

        this.heights = heights;
    
        tableSizeChange$.next({ id: this.tableId });
    }

    observe = (table) => {
        this.dom = table;

        if (!table) return;

        // 监听dom的高度变化
        this.observer = new ResizeObserver(() => {
            this.resizeHandler();
        });

        // 需要添加这一行来开始观察
        this.observer.observe(table);
    }

    destroy(): void {
        this.observer?.disconnect();
    }
}