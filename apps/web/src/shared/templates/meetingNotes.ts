import i18next from 'i18next';

export const meetingNotes = {
    title: i18next.t('template.meetingNotes'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1529336953121-a9fa0f50b4cd?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1748419107/meeting_cover.jpg',
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "meeting-title" }, "content": [ { "type": "text", "text": "会议纪要" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "meeting-info" }, "content": [ { "type": "text", "text": "一、基本信息" } ] },
                { "type": "table", "attrs": { "id": "meeting-table-info" }, "content": [
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [180], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "mt-h1" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "时间" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 3, "rowspan": 1, "colwidth": [620], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "mt-v1" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ] } ] }
                    ] },
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [180], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "mt-h2" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "地点" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 3, "rowspan": 1, "colwidth": [620], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "mt-v2" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ] } ] }
                    ] },
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [180], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "mt-h3" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "与会者" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 3, "rowspan": 1, "colwidth": [620], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "mt-v3" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ] } ] }
                    ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "meeting-agenda" }, "content": [ { "type": "text", "text": "二、议程内容" } ] },
                { "type": "columns", "attrs": { "id": "meeting-cols-agenda", "colWidths": [400, 400] }, "content": [
                    { "type": "column", "attrs": { "id": "meeting-agenda-col1", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "meeting-agenda-h1", "small": true, "emoji": "%F0%9F%93%8C", "color": "", "background": "var(--palette-bg-1)", "border": "var(--palette-border-1)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "议题1：背景与目标" } ] } ] } ] },
                    { "type": "column", "attrs": { "id": "meeting-agenda-col2", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "meeting-agenda-h2", "small": true, "emoji": "%F0%9F%93%8B", "color": "", "background": "var(--palette-bg-3)", "border": "var(--palette-border-3)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "议题2：方案与决策" } ] } ] } ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "meeting-action" }, "content": [ { "type": "text", "text": "三、行动项" } ] },
                { "type": "list", "attrs": { "id": "meeting-action-list" }, "content": [
                    { "type": "list_head", "attrs": { "id": "meeting-action-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "负责人 / 截止日期" } ] },
                    { "type": "list_head", "attrs": { "id": "meeting-action-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "输出物 / 验收标准" } ] }
                ] }
            ] }
        ]
    }
};


