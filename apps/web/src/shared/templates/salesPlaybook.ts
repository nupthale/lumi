import i18next from 'i18next';

export const salesPlaybook = {
    title: i18next.t('template.salesPlaybook'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1748419106/sales_cover.jpg',
    collectionMap: {
        "salesCol-1": {
            schema: {
                viewId: 'defaultView',
                views: [
                    { id: 'defaultView', name: 'Leads', type: 'grid', columnsConfig: [
                        { id: 'company', hidden: false },
                        { id: 'contact', hidden: false },
                        { id: 'stage', hidden: false },
                        { id: 'deal', hidden: false },
                        { id: 'next', hidden: false },
                        { id: 'owner', hidden: false },
                    ], cardConfig: {}, groupBy: { columnId: 'stage' } }
                ],
                columns: [
                    { id: 'company', type: 'text', title: '公司', width: 180, config: {} },
                    { id: 'contact', type: 'text', title: '联系人', width: 140, config: {} },
                    { id: 'stage', type: 'select', title: '阶段', width: 140, config: { options: [
                        { label: '线索', value: 'lead', color: '--N200' },
                        { label: '意向', value: 'intent', color: '--W100' },
                        { label: '谈判', value: 'negotiation', color: '--Y300' },
                        { label: '赢单', value: 'won', color: '--G200' },
                        { label: '丢单', value: 'lost', color: '--R200' }
                    ] } },
                    { id: 'deal', type: 'text', title: '预估金额(¥)', width: 140, config: {} },
                    { id: 'next', type: 'date', title: '下一步', width: 140, config: { format: 'M/D/YYYY' } },
                    { id: 'owner', type: 'text', title: '负责人', width: 120, config: {} },
                ]
            },
            values: [
                { id: 'sl1', company: 'Acme', contact: '张三', stage: ['lead'], deal: '50,000', next: 'Mon, 08 Sep 2025 00:00:00 GMT', owner: 'Ivy' },
                { id: 'sl2', company: 'Beta', contact: '李四', stage: ['negotiation'], deal: '120,000', next: 'Wed, 10 Sep 2025 00:00:00 GMT', owner: 'Leo' }
            ]
        }
    },
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "sales-title" }, "content": [ { "type": "text", "text": "销售作战手册" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "sales-pitch" }, "content": [ { "type": "text", "text": "一、话术与痛点" } ] },
                { "type": "textBlock", "attrs": { "id": "sales-pitch-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "开场、追问、异议处理" } ] } ] },
                { "type": "header", "attrs": { "level": 1, "id": "sales-pipeline" }, "content": [ { "type": "text", "text": "二、销售漏斗" } ] },
                { "type": "collection", "attrs": { "id": "salesCol-1" } },
                { "type": "header", "attrs": { "level": 1, "id": "sales-play" }, "content": [ { "type": "text", "text": "三、打法库" } ] },
                { "type": "columns", "attrs": { "id": "sales-plays-cols", "colWidths": [400, 400] }, "content": [
                    { "type": "column", "attrs": { "id": "sales-play-1", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "sales-play-champ", "small": true, "emoji": "%F0%9F%8F%86", "color": "", "background": "var(--palette-bg-1)", "border": "var(--palette-border-1)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "冠军打法：场景化案例 + 量化ROI" } ] } ] } ] },
                    { "type": "column", "attrs": { "id": "sales-play-2", "background": "" }, "content": [ { "type": "highlight", "attrs": { "id": "sales-play-objection", "small": true, "emoji": "%F0%9F%93%9D", "color": "", "background": "var(--palette-bg-3)", "border": "var(--palette-border-3)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "异议处理：价格 / 风险 / 集成" } ] } ] } ] }
                ] }
            ] }
        ]
    }
};


