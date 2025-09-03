import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { i18next } from '@editor/i18n';

import { FloatMenuTrigger } from '../../_common/floatMenuTrigger';
import { BaseBlockView, Convertible } from '../../_common/baseBlockView';
import { ConvertNodeTypeEnum } from '../../../../interface';

import { Placeholder } from '../../_common/placeholder';

export class TextBlockHeadView extends BaseBlockView implements Convertible {
    floatMenuTrigger: FloatMenuTrigger;

    placeholder: Placeholder;

    constructor(public node: Node, public view: EditorView, public getPos: () => number | undefined) {
        super(node, view, getPos);
        
        // 创建有序列表元素
        this.dom.classList.add('doc-textBlock-head');

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        this.contentDOM = document.createElement('div');

        wrapper.appendChild(this.contentDOM);

        this.dom.appendChild(wrapper);

        this.floatMenuTrigger = new FloatMenuTrigger(this, () => ({
          offsetY: 1,
        }));

        // 创建带样式的占位符元素
        const placeholderContent = this.getPlaceholderContent();
        this.placeholder = new Placeholder(this, placeholderContent);
        wrapper.appendChild(this.placeholder.placeholderElement);
    }

    getPlaceholderContent() {
      // 创建占位符容器
      const content = document.createElement('div');
      // content.innerHTML = `
      //   <span>输入内容，</span>
      //   <span class="doc-placeholder__btn">空格</span>
      //   <span>唤醒AI， </span>
      //   <span class="doc-placeholder__btn doc-placeholder__btn1">/</span>
      //   <span>提供建议</span>
      // `;
      content.innerHTML = i18next.t('editor.placeholder', {
        slash: `<span class="doc-placeholder__btn doc-placeholder__btn1">/</span>`,
        interpolation: { escapeValue: false },
      });

      return content;
    }

    update(node: Node) {
      if (node.type !== this.node.type) return false;
      
      this.node = node; // 更新节点
      return true;
    }

    selectNode() {
      // 返回 false 表示不要应用选中样式
      return false;
    }

    destroy = () => {
      super.destroy();

      this.floatMenuTrigger.destroy();

      this.placeholder?.destroy();
    }

    get convertibleTypes() {
      return [
        ConvertNodeTypeEnum.BULLET_LIST,
        ConvertNodeTypeEnum.ORDERED_LIST,
        ConvertNodeTypeEnum.TODO_LIST,
        ConvertNodeTypeEnum.TOGGLE_LIST,
        ConvertNodeTypeEnum.H1,
        ConvertNodeTypeEnum.H2,
        ConvertNodeTypeEnum.H3,
        ConvertNodeTypeEnum.H4,
        ConvertNodeTypeEnum.H5,
        ConvertNodeTypeEnum.H6,
        ConvertNodeTypeEnum.QUOTE,
        ConvertNodeTypeEnum.HIGHLIGHT,
      ];
    };
}