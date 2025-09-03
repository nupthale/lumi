import { TableControl } from '../table';

import { showPopover$, hidePopover$ } from '@editor/Editor/event';
import { CommandEnum, PopoverTypeEnum } from '@editor/Editor/interface';
import { tableRowCommands, tableColCommands } from '@editor/Editor/shared/bubbleMenu';
import { CellSelection } from '../../cellselection';

import { TableMap } from '@editor/Editor/plugins/nodes/table/tablemap';
import { doc } from '@editor/doc';
import { ResolvedPos } from 'prosemirror-model';

export class OperationBarControl {
    private isSelecting = false;

    private startIndex: number | null = null;

    private endIndex: number | null = null;

    private isTop = false;

    constructor(private table: TableControl) {
        this.initEvt();
    }

    clearDOM = () => {
        if (this.table.operationTop) {
            this.table.operationTop.classList.remove('active');
        }
        
        if (this.table.operationLeft) {
            this.table.operationLeft.classList.remove('active');
        }

        this.clearActive();
    }

    clearActive = () => {
        // 先清除所有样式
        const operationItems = document.querySelectorAll('.doc-table-operationItem');
        operationItems.forEach((item) => {
            item.classList.remove('active');
        });
    }

    addColActive = (start, end) => {
        const operationItems = this.table.tableOperation.querySelectorAll(`.doc-table-operationItem.${this.isTop ? 'top' : 'left'}`);

        const min = Math.min(start, end);
        const max = Math.max(start, end);

        const tableView = this.table.tableView;
        const view = tableView.view;
        const state = view.state;
        const tr = state.tr;
        const doc = state.doc;
        const tableStart = tableView.getPos()!;

        const map = TableMap.get(this.table.node);

        if (!view || !map || !tableStart) return;

        operationItems.forEach((item, index) => {
            if (index >= min && index <= max && !item.classList.contains('active')) {
                item.classList.add('active');
            }
        });

        const fullCells = map.fullCells || [];
        let anchorCell: ResolvedPos | null = null;
        let headCell: ResolvedPos | null = null;

        fullCells.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (colIndex < min || colIndex > max) {
                    return;
                }

                const index = rowIndex * map.width + colIndex;
                
                if (!col || Number(col?.attrs?.colspan) > max - min + 1) return;

                // 找到第一个col存在的, 且anchorCell不存在的
                if (!anchorCell) {
                    anchorCell = doc.resolve(tableStart + 1 + map.map[index]);
                }

                headCell = doc.resolve(tableStart + 1 + map.map[index]);
            })
        })

        if (!anchorCell || !headCell) return;

        tr.setSelection(
            CellSelection.colSelection(
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
               commands: tableColCommands,
               palette: {
                   textColorEnable: false,
                   useLightBgColor: true,
               }
            },
        });
    }

    addRowActive = (start, end) => {
        const operationItems = this.table.tableOperation.querySelectorAll(`.doc-table-operationItem.${this.isTop ? 'top' : 'left'}`);

        const min = Math.min(start, end);
        const max = Math.max(start, end);

        const tableView = this.table.tableView;
        const view = tableView.view;
        const state = view.state;
        const tr = state.tr;
        const doc = state.doc;
        const tableStart = tableView.getPos()!;
        const map = TableMap.get(this.table.node);

        if (!view ||!map ||!tableStart) return;

        operationItems.forEach((item, index) => {
            if (index >= min && index <= max && !item.classList.contains('active')) {
                item.classList.add('active');
            }
        });

        const fullCells = map.fullCells || [];
        let anchorCell: ResolvedPos | null = null;
        let headCell: ResolvedPos | null = null;

        fullCells.forEach((row, rowIndex) => {
            if (rowIndex < min || rowIndex > max) {
                return;
            }

            row.forEach((col, colIndex) => {
                const index = rowIndex * map.width + colIndex;
                
                if (!col || Number(col?.attrs?.rowspan) > max - min + 1) return;

                // 找到第一个col存在的, 且anchorCell不存在的
                if (!anchorCell) {
                    anchorCell = doc.resolve(tableStart + 1 + map.map[index]);
                }

                headCell = doc.resolve(tableStart + 1 + map.map[index]);
            })
        })

        if (!anchorCell || !headCell) return;

        tr.setSelection(
            CellSelection.rowSelection(
                anchorCell,
                headCell,
            )
        );
        view.dispatch(tr);
     
        // 触发显示气泡菜单
        showPopover$.next({
            type: PopoverTypeEnum.BUBBLE_MENU,
            target: operationItems[start] as HTMLElement,
            placement: 'left',
            params: {
               commands: tableRowCommands,
               palette: {
                    textColorEnable: false,
                    useLightBgColor: true,
               }
            },
        });
    }

    handleMouseDown = (e) => {
        const addColDotNode = (e.target as HTMLElement).closest('.doc-table-colResizeDot');
        const addRowDotNode = (e.target as HTMLElement).closest('.doc-table-rowResizeDot');
        const operationItem = (e.target as HTMLElement).closest('.doc-table-operationItem');
        // 先清除所有样式
        this.clearDOM();

        this.startIndex = null;


        if (!operationItem || addColDotNode || addRowDotNode ) return;

        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        this.isTop = operationItem.classList.contains('top');
        const dotNode = operationItem?.children[0];
        const index = dotNode?.getAttribute('data-index');

        this.isSelecting = true;
        this.startIndex = Number(index);
        this.endIndex = Number(index);

        if (this.isTop) {
            this.addColActive(this.startIndex, this.endIndex);
            this.table.operationTop.classList.add('active');
        } else {
            this.addRowActive(this.startIndex, this.endIndex);
            this.table.operationLeft.classList.add('active');
        }
    }

    handleDocumentMouseDown = (e) => {
        this.clearDOM();
    }

    handleMouseMove = (e) => {
        if (!this.isSelecting) return;

        if (this.isTop) {
            this.selectCols(e);
        } else {
            this.selectRows(e);
        }
    }

    selectCols = (e) => {
        const tableContainer = this.table.tableContainer;

        const map = TableMap.get(this.table.node);
        if (!map) return;

        const colWidth = map.colWidths || [];
        // 根据鼠标位置计算选中的列
        const x = e.clientX;
        
        const tableX = tableContainer.getBoundingClientRect().left;

        this.endIndex = colWidth.findIndex((_, index) => {
            const accWidth = colWidth.slice(0, index + 1).reduce((sum, crt) => sum + crt, 0);
            return accWidth > x - tableX;
        });

        this.clearActive();
        this.addColActive(this.startIndex, this.endIndex);
    }

    selectRows = (e) => {
        const tableContainer = this.table.tableContainer;

        const map = TableMap.get(this.table.node);
        const heights = this.table.rowHeights?.heights || [];
        if (!map) return;

        // 根据鼠标位置计算选中的列
        const y = e.clientY;
        
        const tableY = tableContainer.getBoundingClientRect().top;

        this.endIndex = heights.findIndex((_, index) => {
            const accWidth = heights.slice(0, index + 1).reduce((sum, crt) => sum + crt, 0);
            return accWidth > y - tableY;
        });

        this.clearActive();
        this.addRowActive(this.startIndex, this.endIndex);
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
        const container = this.table.tableComponent;

        container?.addEventListener('mousedown', this.handleMouseDown);
        container?.addEventListener('mousemove', this.handleMouseMove, true);
        document?.addEventListener('mouseup', this.handleMouseUp, true);
        document.addEventListener('mousedown', this.handleDocumentMouseDown);
    }

    destroy = () => {
        const container = this.table.tableComponent;

        container?.removeEventListener('mousedown', this.handleMouseDown);
        container?.removeEventListener('mousemove', this.handleMouseMove, true);
        document?.removeEventListener('mouseup', this.handleMouseUp, true);
        document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    }
}