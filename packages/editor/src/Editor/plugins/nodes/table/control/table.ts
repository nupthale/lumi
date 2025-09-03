import { html, render } from 'lit-html';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { i18next } from '@editor/i18n';

import { EventEmit } from '@editor/Editor/shared/event';


import { ResizeControl } from './control/resize';
import { AddControl } from './control/add';
import { ScrollControl } from './control/scroll';
import { OperationBarControl } from './control/operationbar';

import { tableSizeChange$ } from './event';
import { TableView } from '../tableview';
import { TableMap } from '../tablemap';
import { RowHeights } from './rowHeights';

import './index.less';

export class TableControl extends EventEmit {
    private container: HTMLElement | null = null;

    private addControl: AddControl | null = null;
    private resizeControl: ResizeControl | null = null;
    private scrollControl: ScrollControl | null = null;
    private operationBarControl: OperationBarControl | null = null;

    private resizeObserver: ResizeObserver | null = null;

    public rowHeights: RowHeights | null = null;

    private subscriptions: Subscription[] = [];

    private size: {
        colWidth: number[];
        rowHeight: number[];
    } = {
        colWidth: [],
        rowHeight: [],
    };

    constructor(public tableView: TableView) {
        super();

        this.addControl = new AddControl(this);
        this.resizeControl = new ResizeControl(this);
        this.scrollControl = new ScrollControl(this);
        this.operationBarControl = new OperationBarControl(this);

        this.rowHeights = new RowHeights(this.id);

        this.subscribe();
    }

    get id() {
        return this.node.attrs.id;
    }

    get node() {
        return this.tableView.node;
    }

    get table() {
        return this.container?.querySelector('table');
    }

    get rows() {
        return this.table?.querySelectorAll('tr') as NodeListOf<HTMLTableRowElement>;
    }

    get tableContainer() {
        return this.container?.querySelector('.doc-table-container') as HTMLElement;
    }

    get tableWrap() {
        return this.container?.querySelector('.doc-table-wrap') as HTMLElement;
    }

    get tableComponent() {
        return this.container?.querySelector('.doc-table-component') as HTMLElement;
    }

    get tableComponentInner() {
        return this.container?.querySelector('.doc-table-component-inner') as HTMLElement;
    }

    get tableScrollbar() {
        return this.container?.querySelector('.doc-table-scrollbar') as HTMLElement;
    }

    get tableSlider() {
        return this.container?.querySelector('.doc-table-slider') as HTMLElement;
    }

    get body() {
        return this.container?.querySelector('tbody') as HTMLElement;
    }

    get colgroup() {
        return this.container?.querySelector('colgroup') as HTMLTableColElement;
    }

    get tableOperation() {
        return this.container?.querySelector('.doc-table-operation') as HTMLElement;
    }

    get operationTop() {
        return this.container?.querySelector('.doc-table-operationTop') as HTMLElement;
    }

    get operationLeft() {
        return this.container?.querySelector('.doc-table-operationLeft') as HTMLElement;
    }

    get rowResizeLines() {
        return this.container?.querySelector('.doc-table-rowResizeLines') as HTMLElement;
    }

    get colResizeLines() {
        return this.container?.querySelector('.doc-table-colResizeLines') as HTMLElement;
    }
    
    // 根据table_cell上的colwidth attr获取全部的宽度
    // 还需要考虑border的宽度1px
    getTotalWidth() {
        const map = TableMap.get(this.node);
        const total = map.colWidths?.reduce((acc, crt) => acc + crt, 0) || 0;
        return total + 1;
    }

    getTotalHeight(rowHeight) {
        return rowHeight.reduce((acc, crt) => acc + crt, 0) || 0;
    }

    init() {
        this.container = document.createElement('div');

        const html = `
            <div>
                <div class="doc-table-component">
                    <div class="doc-table-component-inner">
                        <div class="doc-table-wrap">
                            <div class="doc-table-container">
                                <table>
                                    <colgroup></colgroup>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>

                            <div class="doc-table-operation" contentEditable="false">
                                <div class="doc-table-operationTop"></div>
                                <div class="doc-table-operationLeft"></div>
                            </div>

                            <div class="doc-table-resizers" contentEditable="false">
                                <div class="doc-table-rowResizeLines"></div>
                                <div class="doc-table-colResizeLines"></div>
                            </div>
                        </div>
                        <div class="doc-table-scrollbar" contentEditable="false">
                            <div class="doc-table-slider"></div>
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

        // modal有动画， 等动画结束再计算，暂时先用timeout解决
        setTimeout(() => {
            this.rowHeights?.observe(this.table);
        }, 600);

        return this.container;
    }

    update() {
        this.updateControl();

        this.updateWidth();

        this.scrollControl?.update();
    }

    updateWidth() {
        if (!this.tableContainer) return;

        const totalWidth = this.getTotalWidth();
        (this.tableContainer as HTMLElement).style.width = `${totalWidth}px`;
    }

    renderOperationTop(size) {
        if (!this.operationTop) return;

        const template = html`
            ${size.colWidth.map((width: number, index: number) => html`
                <div class="doc-table-operationItem top" style="width: ${(width || 100) + (index === size.colWidth.length - 1 ? 1 : 0)}px">
                    <div class="doc-table-colResizeDot" data-id="${this.id}" data-index="${index}">
                        <div class="doc-table-colResizeDotIcon" aria-label="${i18next.t('editor.table.insertCol')}" data-microtip-position="top" role="tooltip">
                            <svg width="22" height="24" viewBox="0 0 22 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.153 20.721A10.999 10.999 0 0022 11c0-6.075-4.925-11-11-11S0 4.925 0 11c0 4.213 2.369 7.873 5.847 9.721L11 24l5.153-3.279z" fill="#3370FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.45 6a.2.2 0 00-.2.2v4.05H6.2a.2.2 0 00-.2.2v1.1c0 .11.09.2.2.2h4.05v4.05c0 .11.09.2.2.2h1.1a.2.2 0 00.2-.2v-4.05h4.05a.2.2 0 00.2-.2v-1.1a.2.2 0 00-.2-.2h-4.05V6.2a.2.2 0 00-.2-.2h-1.1z" fill="#fff"></path></svg>
                        </div>
                    </div>
                    <div class="doc-table-operationLine top"></div>
                </div>
            `)}

            <div class="doc-table-operationItem top" style="width: 0;">
                <div class="doc-table-colResizeDot" data-id="${this.id}" data-index="${size.colWidth?.length}">
                    <div class="doc-table-colResizeDotIcon" aria-label="${i18next.t('editor.table.insertCol')}" data-microtip-position="top" role="tooltip">
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
                <div class="doc-table-colResizeLineWrap" data-id="${this.id}" data-index="${index}" style="left: ${left || 0}px">
                    <div class="doc-table-colResizeLine"></div>
                </div>
            `)}

            <div class="doc-table-colResizeLineWrap" data-id="${this.id}" data-index="${accLeft.length}" style="left: ${totalWidth || 0}px;">
                <div class="doc-table-colResizeLine"></div>
            </div>
        `;

        render(template, this.colResizeLines as HTMLElement);
    }

    renderOperationLeft(size) {
        if (!this.operationLeft) return;

        // height考虑border
        const template = html`
            ${size.rowHeight.map((height: number, index: number) => html`
                <div class="doc-table-operationItem left flex" style="height: ${(height || 100) + (index === size.rowHeight?.length - 1 ? 1 : 0)}px">
                    <div class="doc-table-rowResizeDot" data-id="${this.id}" data-index="${index}">
                        <div class="doc-table-rowResizeDotIcon" aria-label="${i18next.t('editor.table.insertRow')}" data-microtip-position="left" role="tooltip">
                            <svg style="transform: rotate(-90deg)" width="22" height="24" viewBox="0 0 22 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.153 20.721A10.999 10.999 0 0022 11c0-6.075-4.925-11-11-11S0 4.925 0 11c0 4.213 2.369 7.873 5.847 9.721L11 24l5.153-3.279z" fill="#3370FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.45 6a.2.2 0 00-.2.2v4.05H6.2a.2.2 0 00-.2.2v1.1c0 .11.09.2.2.2h4.05v4.05c0 .11.09.2.2.2h1.1a.2.2 0 00.2-.2v-4.05h4.05a.2.2 0 00.2-.2v-1.1a.2.2 0 00-.2-.2h-4.05V6.2a.2.2 0 00-.2-.2h-1.1z" fill="#fff"></path></svg>
                        </div>
                    </div>
                    <div class="doc-table-operationLine left"></div>
                </div>
            `)}

            <div class="doc-table-operationItem left flex" style="height: 0">
                <div class="doc-table-rowResizeDot" data-id="${this.id}" data-index="${size.rowHeight?.length}">
                    <div class="doc-table-rowResizeDotIcon" aria-label="${i18next.t('editor.table.insertRow')}" data-microtip-position="left" role="tooltip">
                        <svg style="transform: rotate(-90deg)" width="22" height="24" viewBox="0 0 22 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.153 20.721A10.999 10.999 0 0022 11c0-6.075-4.925-11-11-11S0 4.925 0 11c0 4.213 2.369 7.873 5.847 9.721L11 24l5.153-3.279z" fill="#3370FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.45 6a.2.2 0 00-.2.2v4.05H6.2a.2.2 0 00-.2.2v1.1c0 .11.09.2.2.2h4.05v4.05c0 .11.09.2.2.2h1.1a.2.2 0 00.2-.2v-4.05h4.05a.2.2 0 00.2-.2v-1.1a.2.2 0 00-.2-.2h-4.05V6.2a.2.2 0 00-.2-.2h-1.1z" fill="#fff"></path></svg>
                    </div>
                </div>
                <div style="width: 10px;"></div>
            </div>
        `;
            
        render(template, this.operationLeft as HTMLElement);
    }

    renderRowResizeLines(size) {
        if (!this.rowResizeLines) return;
         
        // colWidth， 转换为每一项是前面所有项的
        const accTop: number[] = [];
        size.rowHeight.reduce((acc, crt) => {
            accTop.push(acc);
            return acc + crt;
        }, 0);

        const totalWidth = this.getTotalWidth();
        const totalHeight = this.getTotalHeight(size.rowHeight);

        const template = html`
            ${accTop.map((top: number, index: number) => html`
                <div class="doc-table-rowResizeLineWrap" data-id="${this.id}" data-index="${index}" style="top: ${top ? top + (index === 0 ? 0 : 1) : 0}px; width: ${totalWidth}px">
                    <div class="doc-table-rowResizeLine"></div>
                </div>
            `)}

            <div class="doc-table-rowResizeLineWrap" data-id="${this.id}" data-index="${accTop.length}" style="top: ${totalHeight + 1}px; width: ${totalWidth}px">
                <div class="doc-table-rowResizeLine"></div>
            </div>
        `;

        render(template, this.rowResizeLines as HTMLElement);
    }


    updateControl() {
        const rowHeights = this.rowHeights?.heights || [];
        const map = TableMap.get(this.node);

        const size = {
            colWidth: map.colWidths || [],
            rowHeight: rowHeights || [],
        };

        if (
            !rowHeights || 
            !this.operationTop || 
            !this.operationLeft || 
            !this.colgroup || 
            !this.colResizeLines ||
            !this.rowResizeLines
        ) return;

        if (size.colWidth.join('-') !== this.size.colWidth.join('-')) {
            this.renderOperationTop(size);
        }
        
        if (this.size.rowHeight.join('-') !== size.rowHeight.join('-')) {
            this.renderOperationLeft(size);
        }

        this.renderColResizeLines(size);
        this.renderRowResizeLines(size);

        this.size = {
            colWidth: [...size.colWidth],
            rowHeight: [...size.rowHeight],
        };
    }

    subscribe = () => {
        const subscription = tableSizeChange$.pipe(
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

        this.resizeObserver?.disconnect();

        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });

        // 清除所有 lit-html 渲染的内容
        if (this.colgroup) {
            render(null, this.colgroup);
        }
        if (this.operationTop) {
            render(null, this.operationTop);
        }
        if (this.operationLeft) {
            render(null, this.operationLeft);
        }
        if (this.rowResizeLines) {
            render(null, this.rowResizeLines);
        }
        if (this.colResizeLines) {
            render(null, this.colResizeLines);
        }

    }
}