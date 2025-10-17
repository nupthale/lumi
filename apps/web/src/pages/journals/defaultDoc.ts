import { nanoid } from 'nanoid';

export const getDefaultDoc = (title: string) => ({
    "type": "doc",
    "content": [
        {
            "type": "title",
            "attrs": {
                "id": nanoid(8),
                "placeholder": "请输入标题",
                "editable": false,
            },
            "content": [{
                "type": "text",
                "text": title
            }]
        },
        {
            "type": "body",
            "content": [
                {
                    "type": "textBlock",
                    "attrs": {
                        "id": nanoid(8)
                    },
                    "content": [
                        {
                            "type": "textBlock_head",
                            "attrs": {
                                "id": nanoid(8)
                            }
                        }
                    ]
                }
            ]
        }
    ]
});