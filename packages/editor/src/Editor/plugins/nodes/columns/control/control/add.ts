import { addColumn } from '../../commands';
import { ColumnsControl } from '../index';

export class AddControl {
    constructor(private columnsControl: ColumnsControl) {
    }
    
    handleAddClick = (e) => {
        try {
            const colTarget = (e.target as HTMLElement).closest('.doc-columns-colResizeDot');
        
            if (colTarget) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }

            // 新增列
            if (colTarget) {
                this.addCol(colTarget);
                return;
            }
        } catch(e) {
            console.error(e);
        }
    }

    addCol = (colTarget: Element) => {
        const index = Number(colTarget.getAttribute('data-index'));

        const columnsControl = this.columnsControl;
        const columnsView = columnsControl.columnsView;
        const view = columnsView.view;
        const state = view.state;
        const tr = state.tr;
        const dispatch = view.dispatch;

        addColumn(tr, columnsView, index);

        dispatch(tr);
    }

    init = () => {
        this.initEvt();
    }

    initEvt = () => {
        const container = this.columnsControl.columnsComponent;

        container?.addEventListener('click', this.handleAddClick, true);
    }

    destroy = () => {
        const container = this.columnsControl.columnsComponent;

        container?.removeEventListener('click', this.handleAddClick, true);
    }
}