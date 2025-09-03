import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { BaseBlockView } from '../_common/baseBlockView';
import { TopFloatMenuTrigger } from '../_common/topFloatMenuTrigger';

import { Emoji } from './components/Emoji';

import './index.less';
import { CommandEnum } from '@editor/Editor/interface';

export class HighlightView extends BaseBlockView {
  topFloatMenuTrigger: TopFloatMenuTrigger;

  emoji: Emoji;

  iconTextDOM: HTMLElement;
  iconPickerDOM: HTMLElement;

  constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
    super(node, view, getPos, undefined, true);

    // 创建容器元素
    this.dom.classList.add('doc-highlight');
    this.dom.classList.add('flex', 'items-stretch');

    const icon = document.createElement('div');
    icon.classList.add('doc-highlight-iconBtn', 'mr-3', 'relative');
    icon.contentEditable = 'false';
    this.iconTextDOM = document.createElement('span');
    this.iconTextDOM.style.fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"';

    this.iconPickerDOM = document.createElement('div');
    this.iconPickerDOM.classList.add('doc-highlight-emoji');
    icon.appendChild(this.iconTextDOM);
    icon.appendChild(this.iconPickerDOM);

    const content = document.createElement('div');
    content.classList.add('flex-1');

    this.contentDOM = content;

    this.dom.appendChild(icon);
    this.dom.appendChild(content);

    this.emoji = new Emoji(this.iconTextDOM, this.iconPickerDOM);

    this.initEvt();

    this.updateStyle(node);
    this.updateEmoji(node);

    this.topFloatMenuTrigger = new TopFloatMenuTrigger(this, () => {
      return {
        commands: [
          CommandEnum.HIGHLIGHT_PALETTE,
          CommandEnum.HIGHLIGHT_SMALL,
        ]
      };
    });
  }
  
  update(node: Node) {
    if (node.type !== this.node.type) return false;

    this.node = node; // 更新节点
    this.updateStyle(node);
    this.updateEmoji(node);

    return true;
  }

  updateStyle = (node) => {
    this.dom.style.backgroundColor = node.attrs.background;
    this.dom.style.borderColor = node.attrs.border;
    this.dom.style.color = node.attrs.color;

    if (this.contentDOM) {
      setTimeout(() => {
        // 找到contentDOM的第一个block的lineHeight， 然后赋值给icon
        const firstBlock = this.contentDOM?.firstElementChild;
        // 计算firstBlock的lineHeight
        if (firstBlock) {
          const lineHeight = getComputedStyle(firstBlock).lineHeight;
          this.iconTextDOM.style.lineHeight = lineHeight;
        }
      }, 0);
    }
   

    if (node.attrs.small) {
      this.dom.classList.add('small');
    } else {
      this.dom.classList.remove('small');
    }
  }

  updateEmoji = (node) => {
    this.iconTextDOM.innerText = decodeURI(node.attrs.emoji);
  }

  initEvt = () => {
    this.emoji?.on('emojiSelect', (e) => {
      const tr = this.view.state.tr;
      // 不encode， 会报错Uncaught URIError: URI malformed
      tr.setNodeAttribute(this.getPos()!, 'emoji', encodeURI(e));
      this.view.dispatch(tr);
    });
  }

  selectNode() {
    return true;
  }

  destroy() {
    super.destroy();

    this.emoji.destroy();

    this.topFloatMenuTrigger.destroy();
  }
}

