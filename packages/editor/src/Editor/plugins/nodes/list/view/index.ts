import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { BaseBlockView } from '../../_common/baseBlockView';

import '../index.less';

export class ListView extends BaseBlockView {
  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos, undefined, true);

    this.dom.classList.add('doc-list');
    this.contentDOM = this.dom;
  }

  selectNode() {
    // 返回 false 表示不要应用选中样式
    return false;
  }
}