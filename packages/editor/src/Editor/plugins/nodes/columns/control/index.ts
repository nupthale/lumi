import { html, render } from 'lit-html';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { i18next } from '@editor/i18n';

import { EventEmit } from '@editor/Editor/shared/event';

import { ResizeControl } from './control/resize';
import { AddControl } from './control/add';
import { ScrollControl } from './control/scroll';
import { OperationBarControl } from './control/operationbar';
import { SizeObserver } from './sizeObserver'; 

import { columnsSizeChange$ } from './event';

import { ColumnsView } from '../view/columns';

import './index.less';

export class ColumnsControl extends EventEmit {
    private container: HTMLElement | null = null;

    private addControl: AddControl | null = null;
    private resizeControl: ResizeControl | null = null;
    private scrollControl: ScrollControl | null = null;
    public operationBarControl: OperationBarControl | null = null;
    private sizeObserver: SizeObserver | null = null;

    private subscriptions: Subscription[] = [];

    private size: {
        colWidth: number[];
    } = {
        colWidth: [],
    };

    constructor(public columnsView: ColumnsView) {
        super();

        this.addControl = new AddControl(this);
        this.resizeControl = new ResizeControl(this);
        this.scrollControl = new ScrollControl(this);
        this.operationBarControl = new OperationBarControl(this);

        this.sizeObserver = new SizeObserver(this.id);

        this.subscribe();
    }

    get id() {
        return this.node.attrs.id;
    }

    get node() {
        return this.columnsView.node;
    }

    get columnsContent() {
        return this.container?.querySelector('.doc-columns-content') as HTMLElement;
    }

    get columnsContainer() {
        return this.container?.querySelector('.doc-columns-container') as HTMLElement;
    }

    get columnsWrap() {
        return this.container?.querySelector('.doc-columns-wrap') as HTMLElement;
    }

    get columnsComponent() {
        return this.container?.querySelector('.doc-columns-component') as HTMLElement;
    }

    get columnsComponentInner() {
        return this.container?.querySelector('.doc-columns-component-inner') as HTMLElement;
    }

    get columnsScrollbar() {
        return this.container?.querySelector('.doc-columns-scrollbar') as HTMLElement;
    }

    get columnsSlider() {
        return this.container?.querySelector('.doc-columns-slider') as HTMLElement;
    }

    get columnsOperation() {
        return this.container?.querySelector('.doc-columns-operation') as HTMLElement;
    }

    get operationTop() {
        return this.container?.querySelector('.doc-columns-operationTop') as HTMLElement;
    }

    get colResizeLines() {
        return this.container?.querySelector('.doc-columns-colResizeLines') as HTMLElement;
    }
    

    getTotalWidth() {
        return this.node.attrs.colWidths?.reduce((acc, crt) => acc + crt, 0);
    }

    init() {
        this.container = document.createElement('div');

        const html = `
            <div>
                <div class="doc-columns-component">
                    <div class="doc-columns-component-inner">
                        <div class="doc-columns-wrap">
                            <div class="doc-columns-container">
                                <div class="doc-columns-content"></div>
                            </div>

                            <div class="doc-columns-operation" contentEditable="false">
                                <div class="doc-columns-operationTop"></div>
                            </div>

                            <div class="doc-columns-resizers" contentEditable="false">
                                <div class="doc-columns-colResizeLines"></div>
                            </div>
                        </div>
                        <div class="doc-columns-scrollbar" contentEditable="false">
                            <div class="doc-columns-slider"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;

        this.addControl?.init();
        this.operationBarControl?.init();
        this.resizeControl?.init();
        this.scrollControl?.init();
        
        this.sizeObserver?.observe(this.columnsContent);

        return this.container;
    }

    update() {
        this.updateControl();

        this.scrollControl?.update();
    }

    renderOperationTop(size) {
        if (!this.operationTop) return;

        const template = html`
            ${size.colWidth.map((width: number, index: number) => html`
                <div class="doc-columns-operationItem top" style="width: ${width || 100}px">
                    <div class="doc-columns-colResizeDot" data-id="${this.id}" data-index="${index}">
                        <div class="doc-columns-colResizeDotIcon" aria-label="${i18next.t('editor.columns.insert')}" data-microtip-position="top" role="tooltip">
                            <svg width="22" height="24" viewBox="0 0 22 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.153 20.721A10.999 10.999 0 0022 11c0-6.075-4.925-11-11-11S0 4.925 0 11c0 4.213 2.369 7.873 5.847 9.721L11 24l5.153-3.279z" fill="#3370FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.45 6a.2.2 0 00-.2.2v4.05H6.2a.2.2 0 00-.2.2v1.1c0 .11.09.2.2.2h4.05v4.05c0 .11.09.2.2.2h1.1a.2.2 0 00.2-.2v-4.05h4.05a.2.2 0 00.2-.2v-1.1a.2.2 0 00-.2-.2h-4.05V6.2a.2.2 0 00-.2-.2h-1.1z" fill="#fff"></path></svg>
                        </div>
                    </div>
                    <div class="doc-columns-operationLine top"></div>
                </div>
            `)}

            <div class="doc-columns-operationItem top" style="width: 0;">
                <div class="doc-columns-colResizeDot" data-id="${this.id}" data-index="${size.colWidth?.length}">
                    <div class="doc-columns-colResizeDotIcon" aria-label="${i18next.t('editor.columns.insert')}" data-microtip-position="top" role="tooltip">
                        <svg width="22" height="24" viewBox="0 0 22 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.153 20.721A10.999 10.999 0 0022 11c0-6.075-4.925-11-11-11S0 4.925 0 11c0 4.213 2.369 7.873 5.847 9.721L11 24l5.153-3.279z" fill="#3370FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.45 6a.2.2 0 00-.2.2v4.05H6.2a.2.2 0 00-.2.2v1.1c0 .11.09.2.2.2h4.05v4.05c0 .11.09.2.2.2h1.1a.2.2 0 00.2-.2v-4.05h4.05a.2.2 0 00.2-.2v-1.1a.2.2 0 00-.2-.2h-4.05V6.2a.2.2 0 00-.2-.2h-1.1z" fill="#fff"></path></svg>
                    </div>
                </div>
                <div style="height: 10px;"></div>
            </div>
        `;

        render(template, this.operationTop as HTMLElement);
    }

    renderColResizeLines(size) {
        if (!this.colResizeLines) return;
       
        // colWidth， 转换为每一项是前面所有项的
        const accLeft: number[] = [];
        size.colWidth.reduce((acc, crt) => {
             accLeft.push(acc);
             return acc + crt;
        }, 0);

        const totalWidth = this.getTotalWidth();

        const template = html`
            ${accLeft.map((left: number, index: number) => html`
                <div class="doc-columns-colResizeLineWrap" data-id="${this.id}" data-index="${index}" style="left: ${left || 0}px">
                    <div class="doc-columns-colResizeLine"></div>
                </div>
            `)}

            <div class="doc-columns-colResizeLineWrap" data-id="${this.id}" data-index="${accLeft.length}" style="left: ${totalWidth || 0}px;">
                <div class="doc-columns-colResizeLine"></div>
            </div>
        `;

        render(template, this.colResizeLines as HTMLElement);
    }

    updateControl() {
        const colWidths = this.node.attrs.colWidths || [];

        const size = {
            colWidth: colWidths,
        };

        if (
            !this.operationTop || 
            !this.colResizeLines
        ) return;

        if (size.colWidth.join('-') !== this.size.colWidth.join('-')) {
            this.renderOperationTop(size);
        }

        this.renderColResizeLines(size);

        this.size = {
            colWidth: [...size.colWidth],
        };
    }

    subscribe = () => {
        const subscription = columnsSizeChange$.pipe(
            filter(({ id }) => id === this.id),
            tap(() => this.update()),
        ).subscribe();

        this.subscriptions.push(subscription);
    }

    destory = () => {
        super.destroy();

        this.addControl?.destroy();
        this.resizeControl?.destroy();
        this.operationBarControl?.destroy();
        this.scrollControl?.destroy();

        this.subscriptions.forEach((subscription) => subscription.unsubscribe());

        if (this.operationTop) {
            render(null, this.operationTop);
        }
        
        if (this.colResizeLines) {
            render(null, this.colResizeLines);
        }

    }
}