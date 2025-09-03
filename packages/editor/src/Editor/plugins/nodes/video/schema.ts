import { NodeSpec, DOMOutputSpec, Schema } from 'prosemirror-model';
import { nanoid } from 'nanoid';

import { VideoAlignEnum } from './interface';

export const videoSchema: Record<string, NodeSpec> = {
    video: {
      group: 'block',
      content: '', // 不允许有内容
      selectable: true,
      attrs: {
        id: { default: '' },
        src: { default: '' },
        width: { default: '100%' },
        align: { default: VideoAlignEnum.LEFT },
      },
      parseDOM: [{ 
        tag: "div.doc-video", 
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id'),
            width: dom.getAttribute('data-width'),
            align: dom.getAttribute('data-align'),
            src: dom.getAttribute('data-src'),
            content: '',
          }
        },
      }, { 
        tag: "video", 
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id'),
            width: dom.getAttribute('data-width'),
            align: dom.getAttribute('data-align'),
            src: dom.getAttribute('data-src'),
            content: '',
          }
        },
      }],
      toDOM(node): DOMOutputSpec {
        return ["div", {
          class: "doc-video",
          'data-id': node.attrs.id,
          'data-width': node.attrs.width,
          'data-height': node.attrs.height,
          'data-align': node.attrs.align,
          'data-src': node.attrs.src,
        }, '']
      },
      create(schema: Schema, attrs) {
        const id = nanoid();

        return schema.nodes['video'].create({
          ...attrs,
          id,
        }, []);
      }
    },
  };