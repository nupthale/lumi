import { ColumnsControl } from '../index';

import { showPopover$ } from '@editor/Editor/event';
import { PopoverTypeEnum } from '@editor/Editor/interface';
import { columnsColCommands } from '@editor/Editor/shared/bubbleMenu';
import { ColumnSelection } from '../../columnselection';

import { ColumnsMap } from '../../map';

export class OperationBarControl {
    private isSelecting = false;

    private startIndex: number | null = null;

    private endIndex: number | null = null;

    constructor(private columnsControl: ColumnsControl) {
        this.initEvt();
    }

    clearDOM = () => {
        if (this.columnsControl.operationTop) {
            this.columnsControl.operationTop.classList.remove('active');
        }

        this.clearActive();
    }

    clearActive = () => {
        // 先清除所有样式
        const operationItems = document.querySelectorAll('.doc-columns-operationItem');
        operationItems.forEach((item) => {
            item.classList.remove('active');
        });
    }

    addColumnActive = (start, end) => {
        const operationItems = this.columnsControl.columnsOperation.querySelectorAll(`.doc-columns-operationItem.top`);

        const min = Math.min(start, end);
        const max = Math.max(start, end);

        const columnsView = this.columnsControl.columnsView;
        const view = columnsView.view;
        const state = view.state;
        const tr = state.tr;
        const doc = state.doc;
        const columnsStart = columnsView.getPos()!;

        const map = ColumnsMap.get(this.columnsControl.node);

        if (!view || !map || !columnsStart) return;

        operationItems.forEach((item, index) => {
            if (index >= min && index <= max && !item.classList.contains('active')) {
                item.classList.add('active');
            }
        });

        let anchorCell: number = columnsStart + map.map[min];
        let headCell: number = columnsStart + map.map[max];

        if (!anchorCell || !headCell) return;

        tr.setSelection(
            ColumnSelection.create(
                doc,
                anchorCell,
                headCell,
            )
        );
        view.dispatch(tr);

        // 触发显示气泡菜单
        showPopover$.next({
            type: PopoverTypeEnum.BUBBLE_MENU,
            target: operationItems[start] as HTMLElement,
            offset: [0, 0],
            params: {
               commands: columnsColCommands,
               palette: {
                   textColorEnable: false,
                   useLightBgColor: true,
               }
            },
        });
    }

    handleMouseDown = (e) => {
        const addDotNode = (e.target as HTMLElement).closest('.doc-columns-colResizeDot');
        const operationItem = (e.target as HTMLElement).closest('.doc-columns-operationItem');
        // 先清除所有样式
        this.clearDOM();

        this.startIndex = null;

        // 如果点击的是dot， 这里不处理
        if (!operationItem || addDotNode) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        const dotNode = operationItem?.children[0];
        const index = dotNode?.getAttribute('data-index');

        this.isSelecting = true;
        this.startIndex = Number(index);
        this.endIndex = Number(index);

        this.addColumnActive(this.startIndex, this.endIndex);
        this.columnsControl.operationTop.classList.add('active');
    }

    handleMouseMove = (e) => {
        if (!this.isSelecting) return;

        this.selectCols(e);
    }

    selectCols = (e) => {
        const columnsContainer = this.columnsControl.columnsContainer;

        const colWidths = this.columnsControl.node.attrs.colWidths || [];
        // 根据鼠标位置计算选中的列
        const x = e.clientX;
        
        const tableX = columnsContainer.getBoundingClientRect().left;

        this.endIndex = colWidths.findIndex((_, index) => {
            const accWidth = colWidths.slice(0, index + 1).reduce((sum, crt) => sum + crt, 0);
            return accWidth > x - tableX;
        });

        this.clearActive();
        this.addColumnActive(this.startIndex, this.endIndex);
    }

    handleMouseUp = (e) => {
        if (this.isSelecting) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        this.isSelecting = false;
    }

    init = () => {
        this.initEvt();
    }

    initEvt = () => {
        const container = this.columnsControl.columnsComponent;

        container?.addEventListener('mousedown', this.handleMouseDown, true);
        container?.addEventListener('mousemove', this.handleMouseMove, true);
        document.addEventListener('mousedown', this.clearActive, true);
        document?.addEventListener('mouseup', this.handleMouseUp, true);
    }

    destroy = () => {
        const container = this.columnsControl.columnsComponent;

        container?.removeEventListener('mousedown', this.handleMouseDown, true);
        container?.removeEventListener('mousemove', this.handleMouseMove, true);

        document.removeEventListener('mousedown', this.clearActive, true);
        document?.removeEventListener('mouseup', this.handleMouseUp, true);
    }
}