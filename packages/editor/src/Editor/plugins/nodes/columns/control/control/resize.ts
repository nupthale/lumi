import { Node } from 'prosemirror-model';

import { ColumnsControl } from '../index';
import { columnsSizeChange$ } from '../event';

export class ResizeControl {
    private colResizingTarget: HTMLElement | null = null;

    private colStartX: number = 0;

    constructor(private columnsControl: ColumnsControl) {
        this.initEvt();
    }

    proxyOperationDotEnter = (e) => {
        const colTarget = (e.target as HTMLElement).closest('.doc-columns-colResizeDot');

        // 先清空全部的show
        document.querySelectorAll('.doc-columns-colResizeLineWrap').forEach(item => {
            item.classList.remove('show');
        });

        if (colTarget) {
            const index = colTarget.getAttribute('data-index');
            const id = colTarget.getAttribute('data-id');
            const resizeLine = document.querySelector(`.doc-columns-colResizeLineWrap[data-index="${index}"][data-id="${id}"]`);
            if (resizeLine) {
                // 处理你的逻辑
                resizeLine.classList.add('show');
            }
        }
    }

    handleMouseDown = (e) => {
        const colResizingTarget = (e.target as HTMLElement).closest('.doc-columns-colResizeLineWrap');

        this.colResizingTarget = colResizingTarget as HTMLElement;
        this.colStartX = e.clientX;

        if (this.colResizingTarget) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }

    handleMouseMove = (e) => {
        if (this.colResizingTarget) {
            this.colResizingTarget.classList.add('resizing');

            this.resizeCol(e);
            return;
        }
    }

    handleMouseUp = () => {
        this.colResizingTarget = null;

        // 重置所有resizing的class
        document.querySelectorAll('.doc-columns-colResizeLineWrap').forEach(item => {
            item.classList.remove('resizing');
        });
    }

    resizeCol = (e) => {
        if (!this.colResizingTarget) {
            return;
        }

        const index = this.colResizingTarget.getAttribute('data-index');

        const columnsView = this.columnsControl.columnsView;
        const node = columnsView.node;
        const view = columnsView.view;
        const tr = view.state.tr;

        const columnsPos = columnsView.getPos();

        if (columnsPos === undefined || Number(index) < 1) {
            return;
        }

        const colWidths = [...node.attrs.colWidths];
        const oldWidth = colWidths[Number(index) - 1];

        const deltaX = e.clientX - this.colStartX;
        this.colStartX = e.clientX;

        const newWidth = Math.min(Math.max((oldWidth || 0) + deltaX, 100), 800);
        colWidths.splice(Number(index) - 1, 1, newWidth);
    
        tr.setNodeAttribute(columnsPos, 'colWidths', colWidths);

        view.dispatch(tr);
    }

    init = () => {
        this.initEvt();
    }

    initEvt = () => {
        const container = this.columnsControl.columnsComponent;

        container?.addEventListener('mouseover', this.proxyOperationDotEnter, true);
        
        container?.addEventListener('mousedown', this.handleMouseDown, true);
        document?.addEventListener('mousemove', this.handleMouseMove, true);
        document?.addEventListener('mouseup', this.handleMouseUp, true);
    }

    destroy = () => {
        const container = this.columnsControl.columnsComponent;

        container?.removeEventListener('mouseover', this.proxyOperationDotEnter, true);

        container?.removeEventListener('mousedown', this.handleMouseDown, true);
        document?.removeEventListener('mousemove', this.handleMouseMove, true);
        document?.removeEventListener('mouseup', this.handleMouseUp, true);
    }
}

