import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { listStore } from '../../../../store/list';
import { getParentNodeByPos, getRangeByNode } from '../../../../shared';
import { FloatMenuTrigger } from '../../_common/floatMenuTrigger';

import { getOrderedIndex } from '../util';
import { ListTypeEnum } from '../interface';
import { BaseBlockView, Convertible } from '../../_common/baseBlockView';
import { ConvertNodeTypeEnum } from '@editor/Editor/interface';

export class ListHeadView extends BaseBlockView implements Convertible {
    pseudoDOM: HTMLElement;

    listeners: Function[] = [];

    floatMenuTrigger: FloatMenuTrigger;

    constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
        super(node, view, getPos);

        // 创建有序列表元素
        this.dom.classList.add('doc-list-head');
        
        const wrapDOM = document.createElement('div');
        wrapDOM.classList.add('flex-1', 'flex', 'items-start');

        this.pseudoDOM = document.createElement('div');
        this.pseudoDOM.classList.add('doc-list-pseudo');
        this.pseudoDOM.contentEditable = 'false';

        const contentWrap = document.createElement('div');
        contentWrap.classList.add('doc-list-content');

        const contentDOM = document.createElement('span');
        contentWrap.appendChild(contentDOM);
        this.contentDOM = contentDOM;

        wrapDOM.appendChild(this.pseudoDOM);
        wrapDOM.appendChild(contentWrap);

        this.dom.appendChild(wrapDOM);

        this.updatePseudoDOM(node);
        this.updateAttrs(node);

        this.subscribeEvts();

        this.initPseudoEvts();

        this.floatMenuTrigger = new FloatMenuTrigger(this);
    }

    updatePseudoDOM(node) {
      const type = node.attrs.type;
      this.pseudoDOM.innerHTML = this.getPseudo(node, type);
    }

    update(node: Node) {
        if (node.type !== this.node.type) return false;
        
        if (
          node.attrs.id !== this.node.attrs.id ||
          node.attrs.type !== this.node.attrs.type ||
          node.attrs.checked !== this.node.attrs.checked || 
          node.attrs.opened !== this.node.attrs.opened
        ) {
          this.updatePseudoDOM(node);

          this.updateAttrs(node);
        }
      
        // 更新节点引用
        this.node = node;

        return true;
    }

    updateAttrs = (node: Node) => {
      this.dom.setAttribute('data-type', node.attrs.type);
      this.dom.setAttribute('data-checked', node.attrs.checked);
      this.dom.setAttribute('data-opened', node.attrs.opened);
      this.dom.setAttribute('data-index', node.attrs.index);

      if (node.attrs.type === ListTypeEnum.TODO && this.contentDOM) {
        if (node.attrs.checked) {
          this.contentDOM.classList.add('doc-line-through');
        } else {
          this.contentDOM.classList.remove('doc-line-through');
        }
      }
    }

    selectNode() {
      // 返回 false 表示不要应用选中样式
      return false;
    }

    getListId = () => {
      const pos = this.getPos();
      if (pos === undefined) return;
      const parentNode = getParentNodeByPos(this.view, pos + 1);  // 获取父节点（list）
      return parentNode.attrs.id;
    }

    getPseudo = (node: Node, type: ListTypeEnum = ListTypeEnum.BULLET) => {
      const dot = '<div class="text-center" style="-webkit-transform: scale(1.375)">•</div>';

      if (type === ListTypeEnum.ORDERED) {
        const id = this.getListId();

        const map = listStore.getState().orderedListMap || {};
        const indexStr = getOrderedIndex(map[id]);
        
        return indexStr ? `${indexStr}.` : dot;
      }

      if (type === ListTypeEnum.TODO) {
        if (node.attrs.checked) {
          return `<div class="doc-list-checkbox">
            <svg width="12" height="12" fill="none"><path d="M9.589 2.903l.808.809a.35.35 0 010 .495L5.18 9.425a.35.35 0 01-.495 0l-2.981-2.98a.35.35 0 010-.496l.808-.808a.35.35 0 01.495 0l1.925 1.925 4.163-4.163a.35.35 0 01.495 0z" fill="currentColor"></path></svg>
          </div>`;
        }

        return '<div class="doc-list-checkbox"></div>';
      }

      if (type === ListTypeEnum.TOGGLE) {
        const arrow = '<svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 16 16" class="arrowCaretDownFillSmall" style="width: 0.8em; height: 0.8em; display: block; fill: inherit; flex-shrink: 0; transition: transform 200ms ease-out; transform: rotateZ(0deg); opacity: 0.5;"><path d="M2.835 3.25a.8.8 0 0 0-.69 1.203l5.164 8.854a.8.8 0 0 0 1.382 0l5.165-8.854a.8.8 0 0 0-.691-1.203z"></path></svg>';

        if (node.attrs.opened) {
          return `<div class="doc-list-toggle">${arrow}</div>`;
        }

        return `<div class="doc-list-toggle -rotate-90">${arrow}</div>`;
      }

      return dot;
    }

    subscribeEvts() {
      // 订阅 orderedListMap 变化
      const listener = listStore.subscribe((state, prevState) => {
          const pos = this.getPos();

          if (pos === undefined || state.orderedListMap === prevState.orderedListMap) return;

          const id = this.getListId();
          const newIndexes = state.orderedListMap[id];
          const prevIndexes = prevState.orderedListMap[id];

          if (
            newIndexes?.join('-') !== prevIndexes?.join('-')
          ) {
            this.updatePseudoDOM(this.node);
          }
      });

      this.listeners.push(listener);
    }

    pseudoClickHandler = (e) => {
      this.preventSelection(e);

      const pos = this.getPos();
      const tr = this.view.state.tr;
      const type = this.node.attrs?.type;

      if (!pos) return;

      if (type === ListTypeEnum.TODO) {
        tr.setNodeAttribute(pos, 'checked', !this.node.attrs.checked);
      }

      if (type === ListTypeEnum.TOGGLE) {
        const opened = !this.node.attrs.opened

        tr.setNodeAttribute(pos, 'opened', opened);

        // 把对应list-body的class 也toggle一下
        const listNode = this.parentNode;
        if (listNode?.childCount === 2) {
          const listBody = listNode.lastChild;
          const [from] = getRangeByNode(this.view.state, listBody!);

          tr.setNodeAttribute(from, 'opened', opened);
        }
      }

      this.view.dispatch(tr);
    }
    
    preventSelection = (e) => {
      e.stopPropagation();
      e.preventDefault();
    }
    
    initPseudoEvts = () => {
      this.pseudoDOM.addEventListener('click', this.pseudoClickHandler);
      // 防止点击checkbox， 造成选中文本
      this.pseudoDOM.addEventListener('mousedown', this.preventSelection);
      // this.pseudoDOM.addEventListener('mouseup', this.preventSelection);
      this.pseudoDOM.addEventListener('dblclick', this.preventSelection);
    }

    destroy() {
      super.destroy();
    
      this.listeners.forEach((fn) => fn());
      this.floatMenuTrigger.destroy();

      this.pseudoDOM.removeEventListener('click', this.pseudoClickHandler);
      this.pseudoDOM.removeEventListener('mousedown', this.preventSelection);
      this.pseudoDOM.removeEventListener('mouseup', this.preventSelection);
      this.pseudoDOM.removeEventListener('dblclick', this.preventSelection);
    }



  get convertibleTypes() {
    const base = [
      ConvertNodeTypeEnum.TEXT_BLOCK,
      ConvertNodeTypeEnum.QUOTE,
      ConvertNodeTypeEnum.HIGHLIGHT,
    ];

    const type = this.node.attrs.type || ListTypeEnum.BULLET;

    if (type === ListTypeEnum.ORDERED) {
      return base.concat([
        ConvertNodeTypeEnum.BULLET_LIST,
        ConvertNodeTypeEnum.TODO_LIST,
        ConvertNodeTypeEnum.TOGGLE_LIST,
      ]);
    }

    if (type === ListTypeEnum.BULLET) {
      return base.concat([
        ConvertNodeTypeEnum.ORDERED_LIST,
        ConvertNodeTypeEnum.TODO_LIST,
        ConvertNodeTypeEnum.TOGGLE_LIST,
      ]);
    }

    if (type === ListTypeEnum.TODO) {
      return base.concat([
        ConvertNodeTypeEnum.ORDERED_LIST,
        ConvertNodeTypeEnum.BULLET_LIST,
        ConvertNodeTypeEnum.TOGGLE_LIST,
      ]);
    }

    if (type === ListTypeEnum.TOGGLE) {
      return base.concat([
        ConvertNodeTypeEnum.ORDERED_LIST,
        ConvertNodeTypeEnum.BULLET_LIST,
        ConvertNodeTypeEnum.TODO_LIST,
      ]);
    }

    return base;
  };
}