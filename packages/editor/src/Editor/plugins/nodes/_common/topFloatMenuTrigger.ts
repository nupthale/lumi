import { blockMouseEnterTop$, blockMouseLeaveTop$ } from '../../../event';
import { BaseBlockView } from './baseBlockView';

export class TopFloatMenuTrigger {
  constructor(
    public nodeView: BaseBlockView,
    public getMouseEnterProps?: () => Record<string, any>,
  ) {
    this.initFloatMenuEvt();
  }

  mouseEnter = () => {
    blockMouseEnterTop$.next({
      nodeView: this.nodeView,
      offsetY: -30,
      ...this.getMouseEnterProps?.()
    });
  }

  mouseLeave = (e) => {
    blockMouseLeaveTop$.next({
      delay: 200,
    });
  }

  initFloatMenuEvt() {
    if (!this.nodeView?.dom) return;

    this.nodeView.dom.addEventListener('mouseenter', this.mouseEnter);

    this.nodeView.dom.addEventListener('mouseleave', this.mouseLeave);
  }

  destroy() {
    if (!this.nodeView?.dom) return;

    this.nodeView.dom.removeEventListener('mouseenter', this.mouseEnter);
    this.nodeView.dom.removeEventListener('mouseleave', this.mouseleave);
  }
}

