import { nanoid } from 'nanoid';
import { Node } from 'prosemirror-model';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { from, Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { EditorView, NodeView, ViewMutationRecord } from 'prosemirror-view';
import domAlign from 'dom-align';

import './index.less';
import { selectBlock$, updateBlockDrag$, autoCompleteOpen$, showPopover$ } from '../../../event';
import { ConvertNodeTypeEnum, PopoverTypeEnum } from '../../../interface';
import { getTopNodePos } from '@editor/Editor/shared';

// 全局拖拽元素
let globalDrag: HTMLElement | null = null;

function getGlobalDrag() {
  if (!globalDrag) {
    globalDrag = document.createElement('div');
    globalDrag.classList.add('doc-block-drag');
    globalDrag.draggable = true;
    globalDrag.contentEditable = 'false';
    document.body.appendChild(globalDrag);
  }
  return globalDrag;
}

export interface Convertible {
  convertibleTypes: ConvertNodeTypeEnum[];
}

export class BaseBlockView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement | null = null;

  draggable: boolean | undefined;

  drag: HTMLElement | null = null;

  id: string = '';

  subscribers: Subscription[] = [];

  get range() {
    const from = this.getPos() || 0;

    return {
      from,
      to: from + this.node.nodeSize,
    };
  }

  get isEmpty() {
    if (this.node.type.spec?.isolating) {
      return false;
    }

    return this.node.content.size === 0;
  }

  get isFocus() {
    // 检查编辑器是否有焦点
    if (!this.view.hasFocus()) {
      return false;
    }

    // 获取当前选择的位置
    const { from, to } = this.view.state.selection;

    // 获取当前节点的位置范围
    const { from: nodeFrom, to: nodeTo } = this.range;
        
    // 判断光标位置是否在节点范围内
    return from >= nodeFrom && to <= nodeTo;
  }

  get depth() {
    const pos = this.getPos();
    if (pos === undefined) return false;
    
    const $pos = this.view.state.doc.resolve(pos);
    return $pos.depth;  // doc -> body -> block (depth = 2)
  }

  get parentNode() {
    const pos = this.getPos();
    if (pos === undefined) return null;
    
    const $pos = this.view.state.doc.resolve(pos);

    return $pos.node();
  }

  private handleDragStart = (e: DragEvent) => {
    // 如果不是当前节点的拖拽，直接返回
    if (this.drag?.getAttribute('id') !== this.node.attrs.id) return;

    const pos = this.getPos();
    if (pos === undefined) return;

    // 如果是 textBlock_head，选中整个 textBlock
    let selectPos = pos;
    if (['list_head', 'textBlock_head'].includes(this.node.type.name)) {
      const resolvedPos = this.view.state.doc.resolve(pos + 1);
      selectPos = getTopNodePos(this.view.state, resolvedPos).before();
    }

    // 选中节点
    const tr = this.view.state.tr.setSelection(
      NodeSelection.create(
        this.view.state.doc, selectPos
      )
    );
    // 应用事务
    this.view.dispatch(tr);

    // 需要手动触发一下nodeview.dom的dragstart事件，否则
    // https://github.com/ProseMirror/prosemirror-view/blob/f49e21b0cb233e3e4edd5d31026eedcb356bdd53/src/input.ts#L708
    // initInput里的dragstart事件是绑定在nodeView的dom上的， 如果复用drag， 不在dom里， 事件proxy不生效， 需要手动触发一次
    if (this.dom.dispatchEvent) {
      this.dom.dispatchEvent(new DragEvent('dragstart', e));
    }
  };

  private handleDragEnd = () => {
    if (this.drag) {
      this.drag.style.display = 'none';
      this.drag.style.transform = '';
      this.drag.style.left = '';
      this.drag.style.top = '';

      // 取消选区node selection
      this.view.dispatch(
        this.view.state.tr.setSelection(
          TextSelection.create(
            this.view.state.doc,
            this.view.state.selection.from,
          )
        )
      );
    }
  };

  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined, tag: string = 'div', draggable?: boolean) {
    this.dom = document.createElement(tag);
    this.dom.classList.add('doc-block');

    this.draggable = draggable;

    if (node.attrs.id) {
      this.id = node.attrs.id || nanoid(8);
      this.dom.setAttribute('data-id', this.node.attrs.id);
    }

    if (draggable) {
      // 使用全局拖拽元素
      this.drag = getGlobalDrag();
      
      // 添加事件监听
      this.drag.addEventListener('dragstart', this.handleDragStart);
      this.drag.addEventListener('dragend', this.handleDragEnd);
    }

    this.subscribe();
  }

  update(node: Node) {
    if (node.type !== this.node.type) return false;

    this.node = node; // 更新节点
    return true;
  }

  ignoreMutation(record: ViewMutationRecord): boolean {
    const noneEditables = this.dom.querySelectorAll('[contentEditable=false]');

    // 忽略类名变化
    if (record.type === 'attributes' && ['class', 'style'].includes(record.attributeName!)) {
        return true;
    }

    if (noneEditables?.length) {
      for (let i = 0; i < noneEditables.length; i++) {
        if (noneEditables[i].contains(record.target) || record.target === noneEditables[i]) {
          return true;
        }
      }
    }

    return false;
  }

  subscribe() {
    const selectBlockSubscriber = selectBlock$.pipe(
      tap(({ id }) => {
        this.dom.classList.remove('selected');

        if (this.id === id) {
          this.dom.classList.add('selected');
        }
      })
    ).subscribe();

    this.subscribers.push(selectBlockSubscriber);

    // textBlock是draggbale的， textBlock_head不是，但是下面传入的nodeView是textBlock_head的，所以需要在filter特殊处理下。
    if (this.draggable) {
      const blockDragSubscriber = updateBlockDrag$.pipe(
        filter(({ nodeView }) => {
          // 如果是 textBlock_head，这里由对应的texBlock进行过滤
          if (['list_head', 'textBlock_head'].includes(nodeView.node.type.name)) {
            return !!this.node.firstChild?.eq(nodeView.node);
          }

          return nodeView.node?.eq(this.node);
        }),
        tap(({ drag: targetDrag }) => {
          if (this.drag) {
            this.drag.style.display = 'block';
            this.drag.setAttribute('id', this.node.attrs.id);
            domAlign(this.drag, targetDrag, {
              points: ['tl', 'tl'],
              offset: [0, 0],
              overflow: { adjustX: false, adjustY: false },
              useCssTransform: true,
            });
          }
        })
      ).subscribe();
  
      this.subscribers.push(blockDragSubscriber);

      this.subscribers.push(
        autoCompleteOpen$.pipe(
          filter(({ range }) => {
            return range.from >= this.range.from && range.to <= this.range.to;
          }),
          tap(({ range }) => {
            const { from } = range;

            showPopover$.next({
              range: [from, from],
              type: PopoverTypeEnum.AUTO_COMPLETE,
              params: { nodeView: this },
              placement: 'bottom-start',
            });
          })
        ).subscribe()
      );
    }
  }

  destroy() {
    // 移除事件监听
    if (this.drag) {
      this.drag.removeEventListener('dragstart', this.handleDragStart);
      this.drag.removeEventListener('dragend', this.handleDragEnd);
    }
    this.subscribers.forEach(subscriber => subscriber.unsubscribe());
  }
}

