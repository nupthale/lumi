import { Node } from 'prosemirror-model';

import { TableControl } from '../table';
import { TableMap } from '../../tablemap';

// 只支持resize col， 不支持resize row， row高度根据内容自动计算
export class ResizeControl {
    private colResizingTarget: HTMLElement | null = null;

    private colStartX: number = 0;

    constructor(private table: TableControl) {
        this.initEvt();
    }

    proxyOperationDotEnter = (e) => {
        const colTarget = (e.target as HTMLElement).closest('.doc-table-colResizeDot');
        const rowTarget = (e.target as HTMLElement).closest('.doc-table-rowResizeDot');

        // 先清空全部的show
        document.querySelectorAll('.doc-table-colResizeLineWrap').forEach(item => {
            item.classList.remove('show');
        });
    
        document.querySelectorAll('.doc-table-rowResizeLineWrap').forEach(item => {
            item.classList.remove('show');
        })

        if (colTarget) {
            const index = colTarget.getAttribute('data-index');
            const id = colTarget.getAttribute('data-id');
            const resizeLine = document.querySelector(`.doc-table-colResizeLineWrap[data-index="${index}"][data-id="${id}"]`);
            if (resizeLine) {
                // 处理你的逻辑
                resizeLine.classList.add('show');
            }
        }
    
        if (rowTarget) {
            const index = rowTarget.getAttribute('data-index');
            const id = rowTarget.getAttribute('data-id');
            const resizeLine = document.querySelector(`.doc-table-rowResizeLineWrap[data-index="${index}"][data-id="${id}"]`);
            if (resizeLine) {
                // 处理你的逻辑
                resizeLine.classList.add('show');
            }
        }
    }

    handleMouseDown = (e) => {
        const colResizingTarget = (e.target as HTMLElement).closest('.doc-table-colResizeLineWrap');

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
        document.querySelectorAll('.doc-table-colResizeLineWrap').forEach(item => {
            item.classList.remove('resizing');
        });
    }

    resizeCol = (e) => {
        if (!this.colResizingTarget) {
            return;
        }

        const index = this.colResizingTarget.getAttribute('data-index');

        const tableView = this.table.tableView;
        const node = tableView.node;
        const view = tableView.view;
        const tr = view.state.tr;

        const tablePos = tableView.getPos();

        if (tablePos === undefined || Number(index) < 1) {
            return;
        }

        const map = TableMap.get(node);
        const fullCells = map.fullCells || [];

        // 找到index列第一个不为空的node， 然后获取它的colwidth
        let oldWidth = 0;
        fullCells.forEach((row) => {
            row.forEach((cell, cellIndex) => {
                if (cell && cellIndex === Number(index) - 1) {
                    oldWidth = cell?.attrs.colwidth[0];
                }
            })
        });


        const deltaX = e.clientX - this.colStartX;
        this.colStartX = e.clientX;

        const newWidth = Math.min(Math.max((oldWidth || 0) + deltaX, 100), 800);

        const updates: {
            pos: number,
            cell: Node,
            colwidth: number[],
        }[] = [];

        fullCells.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cellIndex === Number(index) - 1) {
                    if (cell) {
                        const colwidth = [...cell.attrs.colwidth];
                        colwidth[0] = newWidth;

                        updates.push({
                            pos: tablePos + map.map[rowIndex * map.width + cellIndex] + 1,
                            cell,
                            colwidth
                        });
                    } else {
                        // cell不存在， 向前找不为空的cell
                        let i = cellIndex - 1;
                        while (i >= 0) {
                            const prevCell = fullCells[rowIndex][i];
                            if (prevCell) {
                                const colwidth = [...prevCell.attrs.colwidth];
                                colwidth[colwidth.length - 1] = newWidth;
                                
                                updates.push({
                                    pos: tablePos + map.map[rowIndex * map.width + i] + 1,
                                    cell: prevCell,
                                    colwidth
                                });

                                break;
                            }
                            i--;
                        }
                    }
                }
            })
        });


        updates.forEach((item) => {
            tr.setNodeMarkup(item.pos, undefined, {
                ...item.cell.attrs,
                colwidth: item.colwidth,
            });
        });
        
        view.dispatch(tr);
    }

    init = () => {
        this.initEvt();
    }

    initEvt = () => {
        const container = this.table.tableComponent;

        container?.addEventListener('mouseover', this.proxyOperationDotEnter, true);
        
        container?.addEventListener('mousedown', this.handleMouseDown, true);
        document?.addEventListener('mousemove', this.handleMouseMove, true);
        document?.addEventListener('mouseup', this.handleMouseUp, true);
    }

    destroy = () => {
        const container = this.table.tableComponent;

        container?.removeEventListener('mouseover', this.proxyOperationDotEnter, true);

        container?.removeEventListener('mousedown', this.handleMouseDown, true);
        document?.removeEventListener('mousemove', this.handleMouseMove, true);
        document?.removeEventListener('mouseup', this.handleMouseUp, true);
    }
}

