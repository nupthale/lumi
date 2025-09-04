import i18next from 'i18next';

export const operationsSOP = {
    title: i18next.t('template.operationsSOP'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1756971724/operations_yfcwzd.png',
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "ops-title" }, "content": [ { "type": "text", "text": "运营SOP" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "ops-scope" }, "content": [ { "type": "text", "text": "一、适用范围" } ] },
                { "type": "textBlock", "attrs": { "id": "ops-scope-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "适用部门、流程环节、角色职责" } ] } ] },
                { "type": "header", "attrs": { "level": 1, "id": "ops-steps" }, "content": [ { "type": "text", "text": "二、标准流程" } ] },
                { "type": "list", "attrs": { "id": "ops-steps-list" }, "content": [
                    { "type": "list_head", "attrs": { "id": "ops-step-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "步骤1：准备" } ] },
                    { "type": "list_head", "attrs": { "id": "ops-step-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "步骤2：执行" } ] },
                    { "type": "list_head", "attrs": { "id": "ops-step-3", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "步骤3：复盘" } ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "ops-raci" }, "content": [ { "type": "text", "text": "三、RACI 责任分配" } ] },
                { "type": "columns", "attrs": { "id": "ops-raci-cols", "colWidths": [380, 420] }, "content": [
                    { "type": "column", "attrs": { "id": "ops-raci-col1", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "ops-raci-r", "small": true, "emoji": "%F0%9F%9B%91%EF%B8%8F", "color": "", "background": "var(--palette-bg-2)", "border": "var(--palette-border-2)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "Responsible / 直接执行" } ] } ] } ] },
                    { "type": "column", "attrs": { "id": "ops-raci-col2", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "ops-raci-a", "small": true, "emoji": "%F0%9F%91%A4", "color": "", "background": "var(--palette-bg-4)", "border": "var(--palette-border-4)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "Accountable / 结果负责" } ] } ] } ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "ops-risk" }, "content": [ { "type": "text", "text": "四、风险与应急" } ] },
                { "type": "list", "attrs": { "id": "ops-risk-list" }, "content": [
                    { "type": "list_head", "attrs": { "id": "ops-risk-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "监控告警阈值与响应SLA" } ] },
                    { "type": "list_head", "attrs": { "id": "ops-risk-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "回滚预案与数据备份" } ] }
                ] }
            ] }
        ]
    }
};


