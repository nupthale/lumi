import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { NodeSelection } from 'prosemirror-state';

import { BaseBlockView, Convertible } from '../_common/baseBlockView';
import { TopFloatMenuTrigger } from '../_common/topFloatMenuTrigger';

import './index.less';

export class QuoteView extends BaseBlockView {
  topFloatMenuTrigger: TopFloatMenuTrigger;

  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos, undefined, true);

    // 创建容器元素
    this.dom.classList.add('doc-quote');

    // 创建
    this.contentDOM = this.dom;

    this.updateStyle(node);

    this.topFloatMenuTrigger = new TopFloatMenuTrigger(this);
  }
  
  update(node: Node) {
    if (node.type !== this.node.type) return false;

    this.node = node; // 更新节点
    this.updateStyle(node);

    return true;
  }

  updateStyle = (node) => {
    this.dom.style.backgroundColor = node.attrs.background;
    this.dom.style.borderColor = node.attrs.border;
    this.dom.style.color = node.attrs.color;

    if (node.attrs.small) {
      this.dom.classList.add('small');
    } else {
      this.dom.classList.remove('small');
    }
  }

  destroy() {
    super.destroy();

    this.topFloatMenuTrigger.destroy();
  }
}

