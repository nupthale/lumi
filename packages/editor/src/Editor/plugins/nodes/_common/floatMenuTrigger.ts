import { blockMouseEnter$, blockMouseLeave$, blockMouseLeaveTop$ } from '../../../event';
import { BaseBlockView } from './baseBlockView';

import { isInNestedBlock } from '@editor/Editor/shared/index';
export class FloatMenuTrigger {
  constructor(
    public nodeView: BaseBlockView,
    public getMouseEnterProps?: () => Record<string, any>,
  ) {
    this.initFloatMenuEvt();
  }

  mouseEnter = () => {
    blockMouseLeave$.next({
      delay: 0,
    });

    const view = this.nodeView.view;
    const pos = this.nodeView.getPos();

    if (!pos) return;

    const resolvedPos = view.state.doc.resolve(pos + 1);

    const isNested = isInNestedBlock(resolvedPos);
    // 如果不是在nested里， 就触发一次blockMouseLeaveTop$
    if (!isNested) {
      blockMouseLeaveTop$.next({
        delay: 0,
      });
    }

    blockMouseEnter$.next({
      nodeView: this.nodeView,
      offsetY: -2,
      ...this.getMouseEnterProps?.()
    });
  }
  mouseleave = (e) => {
    blockMouseLeave$.next({
      delay: 600,
    });
  }

  initFloatMenuEvt() {
    if (!this.nodeView?.dom) return;

    this.nodeView.dom.addEventListener('mouseenter', this.mouseEnter);

    this.nodeView.dom.addEventListener('mouseleave', this.mouseleave);
  }

  destroy() {
    if (!this.nodeView?.dom) return;

    this.nodeView.dom.removeEventListener('mouseenter', this.mouseEnter);
    this.nodeView.dom.removeEventListener('mouseleave', this.mouseleave);
  }
}

