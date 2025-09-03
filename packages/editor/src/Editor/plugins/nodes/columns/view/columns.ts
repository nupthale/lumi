import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { tap } from 'rxjs/operators';

import { BaseBlockView } from '../../_common/baseBlockView';
import { TopFloatMenuTrigger } from '../../_common/topFloatMenuTrigger';

import { ColumnsControl } from '../control/index';
 
import { focusColumns$ } from '../event';
import '../index.less';

export class ColumnsView extends BaseBlockView {
  topFloatMenuTrigger: TopFloatMenuTrigger;

  columnsControl: ColumnsControl;
  
  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos, undefined, true);

    this.dom.classList.add('doc-columns');

    this.columnsControl = new ColumnsControl(this);
    const container = this.columnsControl.init();
    
    this.contentDOM = this.columnsControl.columnsContent!;
   
    this.updateWidths(node);

    this.dom.appendChild(container);
    
    this.topFloatMenuTrigger = new TopFloatMenuTrigger(this);

    setTimeout(() => {
      this.columnsControl?.update();
    }, 0);
   
    this.subscribe();
  }

  updateWidths = (node) => {
    if (!this.contentDOM) return;
    const count = node.attrs.colWidths?.length || 2;
    const fallbackWidths = Array(count).fill('400');

    const pxWidths = (node.attrs.colWidths || fallbackWidths)?.map((width) => {
      return `${width}px`;
    });

    this.contentDOM.style['grid-template-columns'] = pxWidths.join(' ');
  }

  update(node: Node) {
    if (node.type !== this.node.type) return false;

    this.node = node; // 更新节点

    this.updateWidths(node);
    
    return true;
  }

  subscribe = () => {
    super.subscribe();

    this.subscribers.push(
      focusColumns$.pipe(
        tap(({ id }) => {
          this.dom.classList.remove('focused');

          if (this.id === id) {
            this.dom.classList.add('focused');
          } else {
            this.columnsControl.operationBarControl?.clearDOM();
          }
        }),
      ).subscribe(),
    );
  }

  destroy() {
    super.destroy();
    this.topFloatMenuTrigger.destroy();
  }
}