import { createApp, ref, Ref } from 'vue';

import { Node } from 'prosemirror-model';
import { EditorView, ViewMutationRecord } from 'prosemirror-view';

import './index.less';
import { BaseBlockView } from '../_common/baseBlockView';

import { contextStore } from '@editor/Editor/store/context';

import Collection from './bridge/Collection.vue';
import { editorBlur$ } from '@editor/Editor/event';
import { FloatMenuTrigger } from '../_common/floatMenuTrigger'

export class CollectionView extends BaseBlockView {
  app: any;

  mountNode: HTMLElement;

  floatMenuTrigger: FloatMenuTrigger;


  constructor(node: Node, view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos!, undefined, true);

    // 创建容器元素
    this.dom.classList.add('doc-collection');

    // 创建用户信息容器元素
    this.mountNode = document.createElement('div');
    this.mountNode.contentEditable = 'false';

    // 设置contentDOM为标题元素
    this.contentDOM = null;

    // 组装DOM结构
    this.dom.appendChild(this.mountNode);

    this.initEvt();

    this.floatMenuTrigger = new FloatMenuTrigger(this, () => ({
      offsetY: 12,
    }));

    // 使用createApp创建新的Vue应用实例来渲染组件
    if (!this.app) {
      this.mountComponent();
    }
  }

  mountComponent() {
    // 使用createApp创建新的Vue应用实例来渲染Collection组件
    const { docInfo } = contextStore.getState();

    if (!this.app && docInfo) {
      const that = this;

      this.app = createApp(Collection, {
        fileId: docInfo?.fileId,
        collectionId: that.node.attrs.id,
      });

      this.app.mount(this.mountNode);
    }
  }

  update(node: Node) {
    if (node.type !== this.node.type) return false;

    this.node = node;
    return true;
  }


  stopEvent = (e) => {
    e.stopPropagation();

    // 不拦截mouseenter事件， 不拦截拖拽时间， 要不然nodeView拖拽会影响
    if ([
      'mouseenter',
      'dragstart',
      'dragend',
      'dragover',
      'dragenter',
      'dragleave',
      'drop',
    ].includes(e.type)) return false;

    return true;
  };

  blurEditor = () => {
    editorBlur$.next({});
  }

  initEvt = () => {
    // 点击dom的时候， 触发prosemirror的blur
    this.dom.addEventListener('mousedown', this.blurEditor);
    this.dom.addEventListener('mouseup', this.blurEditor);
  }

  ignoreMutation(record: ViewMutationRecord): boolean {    
    return true;
  }

  destroy() {
    // 清理DOM元素
    if (this.app) {
      this.app.unmount();
    }
    
    this.floatMenuTrigger.destroy();

    this.dom.removeEventListener('mousedown', this.blurEditor);
    this.dom.removeEventListener('mouseup', this.blurEditor);
  }
}

