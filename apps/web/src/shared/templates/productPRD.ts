import i18next from 'i18next';

export const productPRD = {
    title: i18next.t('template.productPRD'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1756971480/prd_ppuq0p.png',
    content: {
        "type": "doc",
        "content": [
            {
                "type": "title",
                "attrs": { "id": "prd-title" },
                "content": [
                    { "type": "text", "text": "产品需求文档（PRD）" }
                ]
            },
            {
                "type": "body",
                "content": [
                    {
                        "type": "header",
                        "attrs": { "level": 1, "id": "prd-overview" },
                        "content": [ { "type": "text", "text": "一、概述" } ]
                    },
                    {
                        "type": "textBlock",
                        "attrs": { "id": "prd-overview-txt" },
                        "content": [
                            {
                                "type": "textBlock_head",
                                "attrs": { "id": "" },
                                "content": [ { "type": "text", "text": "目标、背景与问题陈述" } ]
                            }
                        ]
                    },
                    {
                        "type": "header",
                        "attrs": { "level": 2, "id": "prd-persona" },
                        "content": [ { "type": "text", "text": "用户画像" } ]
                    },
                    {
                        "type": "highlight",
                        "attrs": { "id": "prd-persona-card", "small": true, "emoji": "%F0%9F%91%A4", "color": "", "background": "var(--palette-bg-2)", "border": "var(--palette-border-2)" },
                        "content": [
                            { "type": "textBlock", "attrs": { "id": "prd-persona-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "年龄 / 职业 / 场景 / 诉求" } ] } ] }
                        ]
                    },
                    {
                        "type": "header",
                        "attrs": { "level": 1, "id": "prd-scope" },
                        "content": [ { "type": "text", "text": "二、范围与成功标准" } ]
                    },
                    {
                        "type": "list",
                        "attrs": { "id": "prd-success" },
                        "content": [
                            {
                                "type": "list_head",
                                "attrs": { "id": "prd-success-1", "type": "todo", "checked": false, "opened": true },
                                "content": [ { "type": "text", "text": "成功指标1" } ]
                            }
                        ]
                    },
                    {
                        "type": "header",
                        "attrs": { "level": 1, "id": "prd-requirements" },
                        "content": [ { "type": "text", "text": "三、核心需求" } ]
                    },
                    {
                        "type": "highlight",
                        "attrs": { "id": "prd-core", "small": false, "emoji": "%F0%9F%93%9D", "color": "", "background": "var(--palette-bg-4)", "border": "var(--palette-border-4)" },
                        "content": [
                            { "type": "textBlock", "attrs": { "id": "prd-core-1" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "用户故事与验收标准" } ] } ] }
                        ]
                    },
                    {
                        "type": "list",
                        "attrs": { "id": "prd-req-list" },
                        "content": [
                            { "type": "list_head", "attrs": { "id": "prd-req-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "作为【角色】，我希望【能力】，以便【价值]" } ] },
                            { "type": "list_head", "attrs": { "id": "prd-req-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "验收：Given / When / Then" } ] }
                        ]
                    },
                    {
                        "type": "header",
                        "attrs": { "level": 1, "id": "prd-timeline" },
                        "content": [ { "type": "text", "text": "四、里程碑与时间计划" } ]
                    },
                    {
                        "type": "textBlock",
                        "attrs": { "id": "prd-milestone" },
                        "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ]
                    },
                    { "type": "header", "attrs": { "level": 1, "id": "prd-nfr" }, "content": [ { "type": "text", "text": "五、非功能性需求" } ] },
                    { "type": "columns", "attrs": { "id": "prd-nfr-cols", "colWidths": [380, 420] }, "content": [
                        { "type": "column", "attrs": { "id": "prd-nfr-col1", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "prd-perf", "small": true, "emoji": "%E2%9A%A1%EF%B8%8F", "color": "", "background": "var(--palette-bg-3)", "border": "var(--palette-border-3)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "性能：P95 延迟、并发、吞吐" } ] } ] } ] },
                        { "type": "column", "attrs": { "id": "prd-nfr-col2", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "prd-sec", "small": true, "emoji": "%F0%9F%94%92", "color": "", "background": "var(--palette-bg-5)", "border": "var(--palette-border-5)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "安全：鉴权、加密、审计" } ] } ] } ] }
                    ] },
                    { "type": "header", "attrs": { "level": 1, "id": "prd-risk" }, "content": [ { "type": "text", "text": "六、依赖与风险" } ] },
                    { "type": "list", "attrs": { "id": "prd-risk-list" }, "content": [
                        { "type": "list_head", "attrs": { "id": "prd-risk-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "外部服务依赖与降级策略" } ] },
                        { "type": "list_head", "attrs": { "id": "prd-risk-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "法律合规与数据隐私" } ] }
                    ] },
                    { "type": "header", "attrs": { "level": 1, "id": "prd-metrics" }, "content": [ { "type": "text", "text": "七、度量指标" } ] },
                    { "type": "highlight", "attrs": { "id": "prd-metrics-card", "small": false, "emoji": "%F0%9F%93%8A", "color": "", "background": "var(--palette-bg-1)", "border": "var(--palette-border-1)" }, "content": [ { "type": "textBlock", "attrs": { "id": "prd-metrics-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "激活、留存、转化、收入" } ] } ] } ] },
                    { "type": "header", "attrs": { "level": 1, "id": "prd-appendix" }, "content": [ { "type": "text", "text": "八、附录" } ] },
                    { "type": "textBlock", "attrs": { "id": "prd-appendix-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" } } ] }
                ]
            }
        ]
    }
};


