import i18next from 'i18next';

export const okrPlan = {
    title: i18next.t('template.okrPlan'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1748419107/okr_cover.jpg',
    collectionMap: {
        "okrCol-1": {
            schema: {
                viewId: 'defaultView',
                views: [
                    { id: 'defaultView', name: 'OKRs', type: 'grid', columnsConfig: [
                        { id: 'objective', hidden: false },
                        { id: 'key', hidden: false },
                        { id: 'owner', hidden: false },
                        { id: 'progress', hidden: false },
                        { id: 'due', hidden: false }
                    ], cardConfig: {} }
                ],
                columns: [
                    { id: 'objective', type: 'text', title: '目标', width: 220, config: {} },
                    { id: 'key', type: 'text', title: '关键结果', width: 260, config: {} },
                    { id: 'owner', type: 'text', title: '负责人', width: 120, config: {} },
                    { id: 'progress', type: 'select', title: '进度', width: 120, config: { options: [
                        { label: '0-25%', value: 'p25', color: '--N200' },
                        { label: '26-50%', value: 'p50', color: '--W100' },
                        { label: '51-75%', value: 'p75', color: '--Y300' },
                        { label: '76-100%', value: 'p100', color: '--G200' }
                    ] } },
                    { id: 'due', type: 'date', title: '截止日期', width: 140, config: { format: 'M/D/YYYY' } }
                ]
            },
            values: [
                { id: 'okr1', objective: 'Q3 成交额增长 50%', key: '月环比提升 10%', owner: '销售团队', progress: ['p25'], due: 'Mon, 30 Sep 2025 00:00:00 GMT' },
                { id: 'okr2', objective: '用户留存提升 5pt', key: '7日留存从 30% 到 35%', owner: '增长团队', progress: ['p50'], due: 'Mon, 30 Sep 2025 00:00:00 GMT' }
            ]
        }
    },
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "okr-title" }, "content": [ { "type": "text", "text": "OKR 计划" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "okr-guideline" }, "content": [ { "type": "text", "text": "一、制定指南" } ] },
                { "type": "textBlock", "attrs": { "id": "okr-guide-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "聚焦、可衡量、挑战但可达成" } ] } ] },
                { "type": "header", "attrs": { "level": 1, "id": "okr-collection" }, "content": [ { "type": "text", "text": "二、OKR 列表" } ] },
                { "type": "collection", "attrs": { "id": "okrCol-1" } }
            ] }
        ]
    }
};


