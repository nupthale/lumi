import { NodeSpec, Schema } from 'prosemirror-model';
import { nanoid } from 'nanoid';

import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';
import { getTopNodePos } from '@editor/Editor/shared';
import { schema } from '@editor/Editor/plugins/schema/index';

import { updateAttributeDeep } from './util';

/**
 * Notion的有序列表（ordered list）有以下主要规则：
 * - 主列表从1开始自动编号
 * - 支持多级列表嵌套：
 * - 每一个子级都会根据父级序号自动生成，如1.1, 1.2等
 * - 可以有多层嵌套，比如1.1.1, 1.1.2等
 * - 列表重置规则：
 *  - 当有空行（空的text block）分隔时，新的列表会重新从1开始计数
 *  - 不同层级的列表之间互不影响序号计数
 * - 自动维护：
 *  - 在列表中间插入新项时会自动重新排序
 *  - 删除列表项时也会自动调整后续序号
 * 
 * List类型一共4种：
 * - bullet list
 * - order list
 * - todo list
 * - toggleList
 */
export const listSchema: Record<string, NodeSpec> = {
  list: {
    content: "list_head list_body?",
    group: "block",
    attrs: {
      id: { default: '' },
    },
    parseDOM: [{
      tag: "div.doc-list",
      priority: 60,
      getAttrs: (dom: any) => ({
        id: dom.getAttribute('data-id') || nanoid(),
      })
    }, {
      tag: "li",
      priority: 60,
      getAttrs: (dom: any) => ({
        id: dom.getAttribute('data-id') || nanoid(),
      })
    }],
    toDOM(node) {
      return ["div", {
        class: "doc-list",
        'data-id': node.attrs.id,
      }, 0];
    },
    create(schema: Schema, attrs, content = []) {
      const id = nanoid();
      const type = attrs.type;

      return schema.nodes['list'].create({
        id,
      }, [
        schema.node('list_head', { id: nanoid(8), type }, content),
      ]);
    },
    // 其他类型转为 listBlock
    convert(srcNodeView: BaseBlockView, attrs?: Record<string, any>) {
      const node = srcNodeView.node;
      const view = srcNodeView.view;
      const state = view.state;
      const tr = state.tr;
      const doc = state.doc;
      const pos = srcNodeView.getPos();
      const dispatch = view.dispatch;

      if (!pos || !node) return;

      const resolvedPos = doc.resolve(pos + 1);

      if (['textBlock_head'].includes(node.type.name)) {
        const topNodeResolvedPos = getTopNodePos(state, resolvedPos);
        const topNode = topNodeResolvedPos.node();

        // 把head转为header， 然后把body保留原来格式，提升一层。
        const head = topNode.firstChild;
        const body = topNode.childCount > 1 ? topNode.lastChild : null;

        const range = [topNodeResolvedPos.before(), topNodeResolvedPos.after()];

        // 1. 先删除原来的node
        tr.deleteRange(range[0], range[1]);

        // 2. 用body替换整个topNode
        if (body) {
          tr.insert(range[0], body.content);
        }

        // 3. 再在range[0]的位置插入一个新的textBlock
        tr.insert(range[0], schema.nodes['list'].create({
          id: nanoid(8),
        }, [
          schema.node('list_head', { id: nanoid(8), type: attrs?.type }, head.content),
        ]));

        dispatch(tr);

        return;
      } else if (node.type.name === 'list_head') {
        const topNodeResolvedPos = getTopNodePos(state, resolvedPos);
        const topNode = topNodeResolvedPos.node();

        // 如果已经是list， 那么就改下attrs即可，所有的递归子list也要换
        tr.setNodeAttribute(pos, 'type', attrs?.type);
        if (topNode.childCount > 1) {
          updateAttributeDeep(
            topNode.lastChild,
            'list_head',
            'type', 
            attrs?.type,
            state,
            tr,
          );
        }

        dispatch(tr);
        return;
      }

      const range: [number, number] = [
        resolvedPos.before(),
        resolvedPos.after(),
      ];

      const newNode = schema.nodes['list'].create({
        id: nanoid(8),
      }, [
        schema.node('list_head', { id: nanoid(8), type: attrs?.type }, node.content),
      ]);

      tr.replaceRangeWith(range[0], range[1], newNode);
      dispatch(tr);
    }
  },
  list_head: {
    content: "inline*",
    group: "block",
    attrs: {
      id: { default: '' },
      type: { default: 'bullet' },
      // orderList使用， 默认值为空， 代表自动编号， 如果index有值， 则代表手动编号， 不会自动编号
      index: { default: '' },
      checked: { default: false },
      opened: { default: true },
    },
    parseDOM: [{
      tag: "div.doc-list-head",
      priority: 55,  // 增加优先级
      getAttrs(dom: any) {
        return {
          id: dom.getAttribute('data-id'),
          type: dom.getAttribute('data-type') || undefined,
          index: dom.getAttribute('data-index'),
          checked: dom.getAttribute('data-checked') === 'true',
          opened: dom.getAttribute('data-opened') === 'true',
        };
      }
    }],
    toDOM(node) {
      return ["div", {
        class: "doc-list-head",
        'data-id': node.attrs.id,
        'data-type': node.attrs.type,
        'data-index': node.attrs.index,
        'data-checked': node.attrs.checked,
        'data-opened': node.attrs.opened,
      }, 0];
    }
  },
  list_body: {
    content: "block*",
    group: "block",
    attrs: {
      id: { default: '' },
      opened: { default: true },
    },
    parseDOM: [{
      tag: "div.doc-list-body",
      getAttrs(dom: any) {
        return {
          id: dom.getAttribute('data-id'),
          opened: dom.getAttribute('data-opened') === 'true',
        };
      }
    }],
    toDOM(node) {
      return ["div", {
        class: "doc-list-body",
        'data-id': node.attrs.id,
        'data-opened': node.attrs.opened,
      }, 0];
    }
  },
};