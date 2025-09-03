import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';

const urlRegex = /((http|https)?:\/\/[^\s]+)/g;

const traverseLink = (tr) => {
  const decos: Decoration[] = [];
    tr.doc.descendants((node, pos) => {
        if (node.isText) {
          let match;
          while ((match = urlRegex.exec(node.text!)) !== null) {
            const start = pos + match.index;
            const end = start + match[0].length;
            const url = match[0];
            
            decos.push(
              Decoration.inline(start, end, {
                nodeName: 'a',
                href: url,
                target: '_blank',
                rel: 'noopener noreferrer',
                class: 'doc-link',
                style: 'color: #336df4; cursor: pointer; text-decoration: none;'
              })
            );
          }
        }
    });
      
    return DecorationSet.create(tr.doc, decos);
}

export const linkDecorationPlugin = new Plugin({
  key: new PluginKey('link-decoration'),
  state: {
    init(_config, state) {
      return traverseLink(state.tr);
    },
    apply(tr, set) {
      // 重新计算装饰，因为文档可能已更改
      set = set.map(tr.mapping, tr.doc);
      
      // 如果文档没有改变，保持现有装饰
      if (!tr.docChanged) return set;
      
      return traverseLink(tr);
    }
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
    handleClick: (view, pos, event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.classList.contains('doc-link')) {
        const href = target.getAttribute('href');
        if (href) {
          window.open(href, '_blank', 'noopener,noreferrer');
          return true;
        }
      }
      return false;
    },
    handleDragEnd: (view, event) => {
      // 创建一个空的选区（将光标位置设置到文档末尾）
      const { state, dispatch } = view;
      const tr = state.tr.setSelection(Selection.near(state.doc.resolve(state.doc.content.size)));
      dispatch(tr);
      return true;
    }
  }
});