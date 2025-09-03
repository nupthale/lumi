import { TableControl } from '../table';

import { addColumn, addRow } from '../../commands';

import { TableMap } from '../../tablemap';

export class AddControl {
    constructor(private table: TableControl) {
    }
    
    handleAddClick = (e) => {
        try {
            const colTarget = (e.target as HTMLElement).closest('.doc-table-colResizeDot');
            const rowTarget = (e.target as HTMLElement).closest('.doc-table-rowResizeDot');
        
            if (colTarget || rowTarget) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }

            // 新增列
            if (colTarget) {
                this.addCol(colTarget);
                return;
            }
        
            // 新增行
            if (rowTarget) {
                this.addRow(rowTarget);
                return;
            }
        } catch(e) {
            console.error(e);
        }
    }

    addCol = (colTarget: Element) => {
        const index = Number(colTarget.getAttribute('data-index'));

        const table = this.table;
        const tableView = table.tableView;
        const view = tableView.view;
        const state = view.state;
        const tr = state.tr;
        const dispatch = view.dispatch;

        const tableMap = TableMap.get(table.node);
        const tableStart = this.table.tableView.getPos()! + 1;

        if (!tableMap || !tableStart) return;

        addColumn(tr, {
            map: tableMap,
            tableStart,
            table: table.node,
        }, index);

        dispatch(tr);
    }

    addRow = (rowTarget: Element) => {
        const index = Number(rowTarget.getAttribute('data-index'));

        const table = this.table;
        const tableView = table.tableView;
        const view = tableView.view;
        const state = view.state;
        const tr = state.tr;
        const dispatch = view.dispatch;

        const tableMap = TableMap.get(table.node);
        const tableStart = this.table.tableView.getPos()! + 1;

        if (!tableMap || !tableStart) return;

        addRow(tr, {
            map: tableMap,
            tableStart,
            table: table.node,
        }, index);

        dispatch(tr);
    }

    init = () => {
        this.initEvt();
    }

    initEvt = () => {
        const container = this.table.tableComponent;

        container?.addEventListener('click', this.handleAddClick, true);
    }

    destroy = () => {
        const container = this.table.tableComponent;

        container?.removeEventListener('click', this.handleAddClick, true);
    }
}