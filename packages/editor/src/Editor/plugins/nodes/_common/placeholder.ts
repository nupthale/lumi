import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BaseBlockView } from "./baseBlockView";

import { selectionChange$ } from '../../../event';

// 内容为空， 且focus的时候显示。
export class Placeholder {
    private subscribers: Subscription[] = [];

    public placeholderElement: HTMLElement = document.createElement('div');

    constructor(public view: BaseBlockView, public content: HTMLElement) {

        this.placeholderElement.classList.add('doc-placeholder');
        this.placeholderElement.appendChild(content);
        this.placeholderElement.style.display = 'none';

        this.initEvt();
        this.update();
    }

    showPlaceholder() {
        this.placeholderElement.style.display = 'block';
    }

    hidePlaceholder() {
        this.placeholderElement.style.display = 'none';
    }

    update() {
        const node = this.view.node;

        // 检查是否为空（只有 trailingBreak）
        const hasContent = !!node.firstChild?.nodeSize; // 1 是 trailingBreak 的大小
        if (hasContent || !this.view.isFocus) {
            this.hidePlaceholder();
        } else {
            this.showPlaceholder();
        }
    }

    initEvt() {
        this.subscribers.push(
            selectionChange$.pipe(
                tap(() => {
                    this.update();
                })
            ).subscribe()
        );
    }

    destroy() {
        this.subscribers.forEach(subscriber => subscriber.unsubscribe());
    }
}