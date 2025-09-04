import i18next from 'i18next';

export const hrOnboarding = {
    title: i18next.t('template.hrOnboarding'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1756971849/hr_rtppnt.png',
    collectionMap: {
        "hrCol-1": {
            schema: {
                viewId: 'defaultView',
                views: [
                    { id: 'defaultView', name: 'Checklist', type: 'grid', columnsConfig: [
                        { id: 'task', hidden: false },
                        { id: 'owner', hidden: false },
                        { id: 'due', hidden: false },
                        { id: 'status', hidden: false },
                    ], cardConfig: {}, groupBy: { columnId: 'status' } }
                ],
                columns: [
                    { id: 'task', type: 'text', title: '任务', width: 220, config: {} },
                    { id: 'owner', type: 'text', title: '负责人', width: 120, config: {} },
                    { id: 'due', type: 'date', title: '截止日期', width: 140, config: { format: 'M/D/YYYY' } },
                    { id: 'status', type: 'select', title: '状态', width: 120, config: { options: [
                        { label: '待处理', value: 'todo', color: '--N200' },
                        { label: '进行中', value: 'doing', color: '--W100' },
                        { label: '完成', value: 'done', color: '--G200' },
                    ] } },
                ]
            },
            values: [
                { id: 'hr1', task: '签署入职文件', owner: 'HR', due: 'Mon, 01 Sep 2025 00:00:00 GMT', status: ['todo'] },
                { id: 'hr2', task: 'IT设备发放', owner: 'IT', due: 'Tue, 02 Sep 2025 00:00:00 GMT', status: ['doing'] },
                { id: 'hr3', task: '完成入职培训', owner: 'Manager', due: 'Fri, 05 Sep 2025 00:00:00 GMT', status: ['todo'] }
            ]
        }
    },
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "hr-title" }, "content": [ { "type": "text", "text": "HR 入职清单" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "hr-note" }, "content": [ { "type": "text", "text": "一、注意事项" } ] },
                { "type": "textBlock", "attrs": { "id": "hr-note-txt" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "入职节点、资料准备、系统账号" } ] } ] },
                { "type": "header", "attrs": { "level": 1, "id": "hr-collection" }, "content": [ { "type": "text", "text": "二、任务清单" } ] },
                { "type": "collection", "attrs": { "id": "hrCol-1" } }
            ] }
        ]
    }
};


