import i18next from 'i18next';

export const bugReport = {
    title: i18next.t('template.bugReport'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1756972115/bug_dwqtxz.png',
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "bug-title" }, "content": [ { "type": "text", "text": "缺陷报告" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "bug-basic" }, "content": [ { "type": "text", "text": "一、基本信息" } ] },
                { "type": "table", "attrs": { "id": "bug-table-basic" }, "content": [
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [200], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "bug-h1" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "标题" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 3, "rowspan": 1, "colwidth": [600], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "bug-v1" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ] } ] }
                    ] },
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [200], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "bug-h2" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "环境 / 版本" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 3, "rowspan": 1, "colwidth": [600], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "bug-v2" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ] } ] }
                    ] },
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [200], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "bug-h3" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "严重程度 / 优先级" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 3, "rowspan": 1, "colwidth": [600], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "bug-v3" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ] } ] }
                    ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "bug-steps" }, "content": [ { "type": "text", "text": "二、复现步骤" } ] },
                { "type": "list", "attrs": { "id": "bug-steps-list" }, "content": [
                    { "type": "list_head", "attrs": { "id": "bug-step-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "步骤1" } ] },
                    { "type": "list_head", "attrs": { "id": "bug-step-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "步骤2" } ] },
                    { "type": "list_head", "attrs": { "id": "bug-step-3", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "步骤3" } ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "bug-expected" }, "content": [ { "type": "text", "text": "三、期望与实际" } ] },
                { "type": "columns", "attrs": { "id": "bug-cols-exp", "colWidths": [400, 400] }, "content": [
                    { "type": "column", "attrs": { "id": "bug-exp", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "bug-exp-card", "small": true, "emoji": "%F0%9F%8C%B1", "color": "", "background": "var(--palette-bg-1)", "border": "var(--palette-border-1)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "期望结果" } ] } ] } ] },
                    { "type": "column", "attrs": { "id": "bug-actual", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "bug-actual-card", "small": true, "emoji": "%F0%9F%93%9D", "color": "", "background": "var(--palette-bg-3)", "border": "var(--palette-border-3)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "实际结果" } ] } ] } ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "bug-attach" }, "content": [ { "type": "text", "text": "四、附件与日志" } ] },
                { "type": "textBlock", "attrs": { "id": "bug-attach-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "截图、接口请求、后端日志片段" } ] } ] }
            ] }
        ]
    }
};


