import { createApp} from 'vue';

import { Node } from 'prosemirror-model';
import { EditorView, NodeView, ViewMutationRecord } from 'prosemirror-view';

import MentionNode from '../../../components/MentionNode/index.vue';

import './index.less';

export class MentionView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  node: Node;
  view: EditorView;
  app: any;

  constructor(node: Node, view: EditorView) {
    this.node = node;
    this.view = view;

    // 创建容器元素
    this.dom = document.createElement('span');
    this.dom.contentEditable = 'false';
    this.dom.className = 'doc-mention';

    // 创建标题元素
    const user = document.createElement('span');
    user.className = 'inline-flex items-center';
    this.contentDOM = user;

    // 组装DOM结构
    this.dom.appendChild(this.contentDOM);

    // 使用createApp创建新的Vue应用实例来渲染DocMeta组件
    if (!this.app) {
      this.app = createApp(MentionNode, {
        meta: this.node.attrs,
      });
      this.app.mount(this.contentDOM);
    }
  }

  update(node: Node) {
    if (node.type !== this.node.type) return false;
    this.node = node;
    return true;
  }

  ignoreMutation(_record: ViewMutationRecord): boolean {
    return true;
  }

  destroy() {
    // 清理DOM元素
    if (this.app) {
      this.app.unmount();
    }
  }
}

