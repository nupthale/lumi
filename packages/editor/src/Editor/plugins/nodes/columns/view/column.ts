import { Node } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { nanoid } from 'nanoid';

import { schema } from '@editor/Editor/plugins/schema';
import { BaseBlockView } from '../../_common/baseBlockView';

export class ColumnView extends BaseBlockView {
  
  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos);

    this.dom.classList.add('doc-column');

    this.contentDOM = document.createElement('div');

    this.dom.appendChild(this.contentDOM);

    this.dom.style.background = node.attrs.background || '';

    this.initEvt();
  }

  update(node: Node): boolean {
    if (node.type !== this.node.type) return false;
    this.node = node;
    this.dom.style.background = node.attrs.background || '';
    return true;
  }

  handleDomClick = () => {
    // 如果末尾没有空行， 则新增一行空行， 并且光标移到新行
    const lastChild = this.node.lastChild;

    if (lastChild?.textContent?.trim() !== '') {
      const { tr } = this.view.state;
      const pos = this.getPos();
      
      if (pos === undefined) return; 

      const endPos = pos + this.node.nodeSize;

      const emptyTextBlock = schema.nodes.textBlock.create({
        id: nanoid(8),
      }, [
        schema.nodes.textBlock_head.create({}, [])
      ]);

      tr.insert(endPos - 1, emptyTextBlock);

      tr.setSelection(TextSelection.create(tr.doc, endPos + 1));

      this.view.dispatch(tr);
    }
  }

  stopPropogation = (e: MouseEvent) => {
    e.stopPropagation();
  }

  initEvt = () => {
    this.dom.addEventListener('click', this.handleDomClick);
    this.contentDOM?.addEventListener('click', this.stopPropogation);
  }

  destroy() {
    super.destroy();

    this.dom.removeEventListener('click', this.handleDomClick);
    this.contentDOM?.removeEventListener('click', this.stopPropogation);
  }
}