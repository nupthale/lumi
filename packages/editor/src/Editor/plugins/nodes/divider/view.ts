import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { BaseBlockView } from '../_common/baseBlockView';
import { FloatMenuTrigger } from '../_common/floatMenuTrigger';

import './index.less';

export class DividerView extends BaseBlockView {
  floatMenuTrigger: FloatMenuTrigger;

  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos, undefined, true);

    // 创建容器元素
    this.dom.classList.add('doc-divider');
    
    this.contentDOM = null;

    this.floatMenuTrigger = new FloatMenuTrigger(this);
  }

  update(node: Node) {
    if (node.type !== this.node.type) return false;

    this.node = node; // 更新节点
    return true;
  }

  selectNode() {
    return true;
  }

  destroy() {
    super.destroy();

    this.floatMenuTrigger.destroy();
  }
}

