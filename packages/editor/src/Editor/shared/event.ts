// 实现一个eventEmit class， 包括on、off、emit、once方法
export class EventEmit {
    private events: Record<string, Function[]> = {};

    on(event: string, fn: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(fn);
    }

    off(event: string, fn: Function) {
        if (!this.events[event]) {
            return;                 
        }
        this.events[event] = this.events[event].filter((f) => f !== fn);
    }

    emit(event: string, ...args: any[]) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach((fn) => fn(...args));
    }

    once(event: string, fn: Function) {
        const onceFn = (...args: any[]) => {
            fn(...args);
            this.off(event, onceFn);
        }
        this.on(event, onceFn);
    }

    destroy() {
        this.events = {};
    }
}

export const stopEvent = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
}

export const isInIgnoreEventList = (event: MouseEvent | null) => {
    if (!event) return false;

    return (
        (event.target as HTMLElement).closest('.menuItems') ||
        (event.target as HTMLElement).closest('.doc-block-drag') ||
        (event.target as HTMLElement).closest('.popover') ||
        (event.target as HTMLElement).closest('.ant-popover') ||
        (event.target as HTMLElement).closest('.ProseMirror') ||
        (event.target as HTMLElement).closest('.ant-input') ||
        (event.target as HTMLElement).closest('.actionDrag')
    );
}