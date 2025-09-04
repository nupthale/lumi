import i18next from 'i18next';

export const marketingCampaign = {
    title: i18next.t('template.marketingCampaign'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1498008551092-1cfe65f19d35?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1748419106/marketing_cover.jpg',
    collectionMap: {
        "mkCol-1": {
            schema: {
                viewId: 'defaultView',
                views: [
                    {
                        id: 'defaultView',
                        name: 'Campaigns',
                        type: 'grid',
                        columnsConfig: [
                            { id: 'name', hidden: false },
                            { id: 'channel', hidden: false },
                            { id: 'owner', hidden: false },
                            { id: 'start', hidden: false },
                            { id: 'end', hidden: false },
                            { id: 'status', hidden: false },
                            { id: 'budget', hidden: false },
                        ],
                        cardConfig: {},
                        groupBy: { columnId: 'status' }
                    }
                ],
                columns: [
                    { id: 'name', type: 'text', title: '活动名称', width: 200, config: {} },
                    { id: 'channel', type: 'select', title: '投放渠道', width: 140, config: { options: [
                        { label: '抖音', value: 'dy', color: '--W100' },
                        { label: '微信', value: 'wx', color: '--G200' },
                        { label: '小红书', value: 'xhs', color: '--R200' },
                        { label: '快手', value: 'ks', color: '--Y300' },
                        { label: 'B站', value: 'bz', color: '--O200' },
                    ] } },
                    { id: 'owner', type: 'text', title: '负责人', width: 120, config: {} },
                    { id: 'start', type: 'date', title: '开始时间', width: 140, config: { format: 'M/D/YYYY' } },
                    { id: 'end', type: 'date', title: '结束时间', width: 140, config: { format: 'M/D/YYYY' } },
                    { id: 'status', type: 'select', title: '状态', width: 120, config: { options: [
                        { label: '规划中', value: 'plan', color: '--N200' },
                        { label: '进行中', value: 'doing', color: '--W100' },
                        { label: '已完成', value: 'done', color: '--G200' },
                    ] } },
                    { id: 'budget', type: 'text', title: '预算(¥)', width: 120, config: {} },
                ]
            },
            values: [
                { id: 'mk1', name: '618大促', channel: ['dy'], owner: 'Alice', start: 'Mon, 02 Jun 2025 00:00:00 GMT', end: 'Fri, 20 Jun 2025 00:00:00 GMT', status: ['plan'], budget: '200,000' },
                { id: 'mk2', name: '新品发布', channel: ['wx'], owner: 'Bob', start: 'Mon, 07 Jul 2025 00:00:00 GMT', end: 'Fri, 18 Jul 2025 00:00:00 GMT', status: ['doing'], budget: '80,000' },
            ]
        }
    },
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "mk-title" }, "content": [ { "type": "text", "text": "营销活动计划" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "mk-brief" }, "content": [ { "type": "text", "text": "一、活动简介" } ] },
                { "type": "textBlock", "attrs": { "id": "mk-brief-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "目标人群、核心卖点、关键信息" } ] } ] },
                { "type": "header", "attrs": { "level": 1, "id": "mk-goals" }, "content": [ { "type": "text", "text": "二、目标指标" } ] },
                { "type": "list", "attrs": { "id": "mk-goal-list" }, "content": [
                    { "type": "list_head", "attrs": { "id": "mk-goal-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "曝光 / 触达 / CTR" } ] },
                    { "type": "list_head", "attrs": { "id": "mk-goal-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "转化 / CAC / ROI" } ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "mk-collection" }, "content": [ { "type": "text", "text": "二、活动列表" } ] },
                { "type": "collection", "attrs": { "id": "mkCol-1" } }
            ] }
        ]
    }
};


