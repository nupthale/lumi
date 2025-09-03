import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { BaseBlockView } from '../_common/baseBlockView';
import { FloatMenuTrigger } from '../_common/floatMenuTrigger'

import { Iframe } from './components/Iframe/index';

import './index.less';

const MAX_WIDTH = 820;
const MIN_WIDTH = 100;

export class IframeView extends BaseBlockView {
  floatMenuTrigger: FloatMenuTrigger;

  iframe: Iframe;
  iframeDOM: HTMLElement;
  containerDOM: HTMLElement;
  leftResizerDOM: HTMLElement;
  rightResizerDOM: HTMLElement;

  resizing: 'left' | 'right' | null = null;
  resizeX = 0;

  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos, undefined, true);

    // 创建容器元素
    this.dom.classList.add('doc-iframe');

    this.containerDOM = document.createElement('div');
    this.containerDOM.classList.add('doc-iframe-container');
    this.containerDOM.contentEditable = 'false';
  
    this.iframeDOM = document.createElement('div');
    this.iframeDOM.classList.add('w-full');

    this.containerDOM.appendChild(this.iframeDOM);
    this.containerDOM.style.width = `${node.attrs.width ? node.attrs.width + 'px' : '100%' }`;
    if (node.attrs.src) {
      this.containerDOM.classList.add('hasSrc');
    }

    this.leftResizerDOM = document.createElement('div');
    this.leftResizerDOM.classList.add('doc-iframeDOM-resizer', 'left');
    this.containerDOM.appendChild(this.leftResizerDOM);

    this.rightResizerDOM = document.createElement('div');
    this.rightResizerDOM.classList.add('doc-iframeDOM-resizer', 'right');
    this.containerDOM.appendChild(this.rightResizerDOM);

    // 组装DOM结构
    this.dom.appendChild(this.containerDOM);
    this.contentDOM = null;

    this.floatMenuTrigger = new FloatMenuTrigger(this);

    this.iframe = new Iframe(this.iframeDOM);
    this.iframe.render(node.attrs);

    this.initEvt();

    this.updateAttrs(node);
  }

  selectNode() {
    // 返回 false 表示不要应用选中样式
    return true;
  }

  update(node: Node) {
    if (node.type !== this.node.type) return false;

    if (!this.containerDOM) return false;

    if (
      node.attrs.src !== this.node.attrs.src
    ) {
      this.iframe.render(node.attrs);
    }

    if (node.attrs.width !== this.node.attrs.width) {
      this.containerDOM.style.width = `${node.attrs.width ? node.attrs.width + 'px' : '100%' }`;
    }

    if (node.attrs.src) {
      this.containerDOM.classList.add('hasSrc');
    } else {
      this.containerDOM.classList.remove('hasSrc');
    }

    this.updateAttrs(node);

    this.node = node; // 更新节点
    return true;
  }

  updateAttrs = (node: Node) => {
    this.dom.setAttribute('data-id', node.attrs.id);
    this.dom.setAttribute('data-width', node.attrs.width);
    this.dom.setAttribute('data-src', node.attrs.src);
  }

  toggleShowResizer = () => {
    if (this.resizing) {
      this.leftResizerDOM.style.opacity = '1';
      this.rightResizerDOM.style.opacity = '1';
    } else {
      this.leftResizerDOM.style.opacity = '0';
      this.rightResizerDOM.style.opacity = '0';
    }
  }

  startResizeLeft = (e) => {
    this.resizing = 'left';
   
    this.resizeX = e.clientX;

    this.toggleShowResizer();
  }

  startResizeRight = (e) => {
    this.resizing = 'right';

    this.resizeX = e.clientX;

    this.toggleShowResizer();
  }

  endResize = () => {
    this.resizing = null;
    
    this.toggleShowResizer();
  }

  resize = (e) => {
    if (!this.resizing) return;

    const deltaX = this.resizing === 'left' ? this.resizeX - e.clientX : e.clientX - this.resizeX;
    this.resizeX = e.clientX;

    const pos = this.getPos();
    if (pos === undefined) return;

    // 计算新的宽度
    const currentWidth = this.iframeDOM.getBoundingClientRect().width;
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, currentWidth + deltaX)); // 限制最小50px，最大800px

    // 更新节点属性
    const tr = this.view.state.tr;
    tr.setNodeAttribute(pos, 'width', newWidth);
    this.view.dispatch(tr);
  }

  updateSrc = ({ src }) => {
    const pos = this.getPos();
    if (pos === undefined) return;

    const tr = this.view.state.tr;
    if (src) {
      tr.setNodeAttribute(pos, 'src', src);
    }

    this.view.dispatch(tr);
  }

  getWidth = (width) => {
    if (width) return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width));

    return '100%';
  }

  initEvt = () => {
    this.leftResizerDOM.addEventListener('mousedown', this.startResizeLeft);
    this.rightResizerDOM.addEventListener('mousedown', this.startResizeRight);
    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.endResize);

    this.iframe.on('change', this.updateSrc);
  }

  destroy() {
    super.destroy();

    this.floatMenuTrigger.destroy();

    this.leftResizerDOM.removeEventListener('mousedown', this.startResizeLeft);
    this.rightResizerDOM.removeEventListener('mousedown', this.startResizeRight);
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.endResize);

    this.iframe.destory();
  }
}

