import { Schema } from 'prosemirror-model';

export const defaultDoc = {
    "type": "doc",
    "content": [
        {
            "type": "title",
            "attrs": {
                "id": 'default_title',
                "placeholder": "请输入标题123"
            }
        },
        {
            "type": "body",
            "content": [
                {
                    "type": "textBlock",
                    "attrs": {
                        "id": 'default_textBlock'
                    },
                    "content": [
                        {
                            "type": "textBlock_head",
                            "attrs": {
                                "id": 'default_textBlock_head'
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const nodes = {
    doc: {
        content: "title body"
    },

    title: {
        content: "inline*",
        defining: true,
        selectable: false,
        group: "block",
        attrs: {
            id: { default: '' },
            placeholder: { default: '' },
        },
    },
    body: {
        content: 'block+',
    },

    textBlock: {
        content: "textBlock_head textBlock_body?",
        group: 'block',
        attrs: {
          id: { default: '' },
        },
    },

    textBlock_head: {
        content: "inline*",
        attrs: {
            id: { default: '' },
        },
    },

    textBlock_body: {
        content: 'block*',
        group: 'block',
        attrs: {
            id: { default: '' },
        },
    },
    
    // 文本节点
    text: {
        group: 'inline'
    },
};

export const minimalSchema = new Schema({ nodes, marks: {} });