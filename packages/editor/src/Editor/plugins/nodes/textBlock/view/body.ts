import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { BaseBlockView } from '../../_common/baseBlockView';

export class TextBlockBodyView extends BaseBlockView {

    constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
        super(node, view, getPos);

        this.dom.classList.add('doc-textBlock-body');
        
        this.contentDOM = this.dom;
    }

    selectNode() {
        // 返回 false 表示不要应用选中样式
        return false;
    }
}