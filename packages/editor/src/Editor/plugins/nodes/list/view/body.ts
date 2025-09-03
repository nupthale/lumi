import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { BaseBlockView } from '../../_common/baseBlockView';

export class ListBodyView extends BaseBlockView {
    constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
        super(node, view, getPos);

        // 创建有序列表元素
        this.dom.classList.add('doc-list-body');
        
        this.contentDOM = this.dom;

        this.updateAttribute(node);
    }

    update(node: Node) {
        if (node.type !== this.node.type) return false;
    
        if (node.attrs.opened !== this.node.attrs.opened) {
            this.toggleOpened(node.attrs.opened);
            this.updateAttribute(node);
        }

        this.node = node; // 更新节点
        return true;
    }

    updateAttribute = (node) => {
        this.dom.setAttribute('data-opened', node.attrs.opened);
    }

    toggleOpened = (opened: boolean) => {
        if (opened) {
            this.dom.classList.remove('hidden');
        } else if (!this.dom.classList.contains('hidden')) {
            this.dom.classList.add('hidden');
        }
    }

    selectNode() {
        // 返回 false 表示不要应用选中样式
        return false;
    }
}