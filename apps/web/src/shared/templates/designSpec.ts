import i18next from 'i18next';

export const designSpec = {
    title: i18next.t('template.designSpec'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1756971576/design_y8wqxc.png',
    content: {
        "type": "doc",
        "content": [
            {
                "type": "title",
                "attrs": { "id": "design-title" },
                "content": [ { "type": "text", "text": "设计说明书" } ]
            },
            {
                "type": "body",
                "content": [
                    { "type": "header", "attrs": { "level": 1, "id": "design-goal" }, "content": [ { "type": "text", "text": "一、目标与原则" } ] },
                    { "type": "textBlock", "attrs": { "id": "design-goal-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "品牌、一致性、可用性、可访问性" } ] } ] },
                    { "type": "header", "attrs": { "level": 1, "id": "design-components" }, "content": [ { "type": "text", "text": "二、组件与交互" } ] },
                    { "type": "textBlock", "attrs": { "id": "design-components-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "组件结构、状态、交互反馈" } ] } ] },
                    { "type": "columns", "attrs": { "id": "design-cols", "colWidths": [360, 440] }, "content": [
                        { "type": "column", "attrs": { "id": "design-col-1", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "design-state", "small": true, "emoji": "%F0%9F%94%8D", "color": "", "background": "var(--palette-bg-1)", "border": "var(--palette-border-1)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "状态：默认 / 悬浮 / 激活 / 禁用" } ] } ] } ] },
                        { "type": "column", "attrs": { "id": "design-col-2", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "design-motion", "small": true, "emoji": "%E2%9C%A8", "color": "", "background": "var(--palette-bg-3)", "border": "var(--palette-border-3)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "动效：时长 / 曲线 / 延迟" } ] } ] } ] }
                    ] },
                    { "type": "header", "attrs": { "level": 1, "id": "design-spec" }, "content": [ { "type": "text", "text": "三、规格说明" } ] },
                    { "type": "list", "attrs": { "id": "design-spec-list" }, "content": [
                        { "type": "list_head", "attrs": { "id": "design-spec-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "色板：主色 / 中性色 / 语义色" } ] },
                        { "type": "list_head", "attrs": { "id": "design-spec-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "字号与行高：标题 / 正文 / 说明" } ] },
                        { "type": "list_head", "attrs": { "id": "design-spec-3", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "间距系统：8px 基础刻度" } ] },
                        { "type": "list_head", "attrs": { "id": "design-spec-4", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "栅格：列数 / 间隙 / 外边距" } ] }
                    ] },
                    { "type": "header", "attrs": { "level": 1, "id": "design-accessibility" }, "content": [ { "type": "text", "text": "四、可访问性" } ] },
                    { "type": "highlight", "attrs": { "id": "design-a11y", "small": false, "emoji": "%F0%9F%93%9A", "color": "", "background": "var(--palette-bg-5)", "border": "var(--palette-border-5)" }, "content": [ { "type": "textBlock", "attrs": { "id": "design-a11y-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "对比度 / 焦点可见 / 键盘可达" } ] } ] } ] }
                ]
            }
        ]
    }
};


