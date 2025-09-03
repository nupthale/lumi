import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { BaseBlockView, Convertible } from '../_common/baseBlockView';
import { FloatMenuTrigger } from '../_common/floatMenuTrigger';
import { NodeViewEnum, ConvertNodeTypeEnum } from '@editor/Editor/interface';
import './index.less';

export class HeaderView extends BaseBlockView implements Convertible {
  level: number = 1;

  floatMenuTrigger: FloatMenuTrigger;

  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos, undefined, true);

    this.level = node.attrs.level;

    // 创建容器元素
    this.dom.classList.add('doc-header');
    
    this.render();

    this.floatMenuTrigger = new FloatMenuTrigger(this, this.getMouseEnterProps);
  }

  render() {
    this.dom.className = this.dom.className.replace(/level\d/gm, '').trim();

    const level = this.node.attrs.level;
    this.dom.classList.add(`level${level}`);

    const orginalContent = this.contentDOM?.innerHTML || '';
    if (this.contentDOM) {
       // 删除this.contentDOM
       this.contentDOM.remove();
    }

    this.contentDOM = document.createElement(`h${level}`);
    this.contentDOM.innerHTML = orginalContent;
    this.dom.appendChild(this.contentDOM);
  }

  update(node: Node) {
    if (node.type !== this.node.type) return false;

    this.node = node; // 更新节点
    if (node.attrs.level !== this.level) {
      this.render();
    }
    this.level = node.attrs.level;

    return true;
  }

  getMouseEnterProps = () => {
    const map = {
      1: 5,
      2: 2,
      3: 0,
    }

    return {
      offsetY: map[this.level] || -1,
    }
  }

  destroy() {
    super.destroy();

    this.floatMenuTrigger.destroy();
  }

  get convertibleTypes() {
    const base = [
      ConvertNodeTypeEnum.TEXT_BLOCK,
      ConvertNodeTypeEnum.QUOTE,
      ConvertNodeTypeEnum.HIGHLIGHT,

      ConvertNodeTypeEnum.BULLET_LIST,
      ConvertNodeTypeEnum.ORDERED_LIST,
      ConvertNodeTypeEnum.TODO_LIST,
      ConvertNodeTypeEnum.TOGGLE_LIST,
    ];

    const headings = [
      ConvertNodeTypeEnum.H1,
      ConvertNodeTypeEnum.H2,
      ConvertNodeTypeEnum.H3,
      ConvertNodeTypeEnum.H4,
      ConvertNodeTypeEnum.H5,
      ConvertNodeTypeEnum.H6,
    ];
    
    headings.splice(this.level - 1, 1);

    return [
      ...base,
      ...headings,
    ];
  };
}

