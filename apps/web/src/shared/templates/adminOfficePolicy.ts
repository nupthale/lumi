import i18next from 'i18next';

export const adminOfficePolicy = {
    title: i18next.t('template.adminOfficePolicy'),
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1748419107/admin_cover.jpg',
    content: {
        "type": "doc",
        "content": [
            { "type": "title", "attrs": { "id": "admin-title" }, "content": [ { "type": "text", "text": "行政办公规范" } ] },
            { "type": "body", "content": [
                { "type": "header", "attrs": { "level": 1, "id": "admin-1" }, "content": [ { "type": "text", "text": "一、办公秩序" } ] },
                { "type": "columns", "attrs": { "id": "admin-cols-1", "colWidths": [400, 400] }, "content": [
                    { "type": "column", "attrs": { "id": "admin-col-1", "background": "" }, "content": [
                        { "type": "highlight", "attrs": { "id": "admin-att", "small": true, "emoji": "%F0%9F%93%85", "color": "", "background": "var(--palette-bg-1)", "border": "var(--palette-border-1)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "考勤：上下班打卡、加班与调休、请假流程" } ] } ] }
                    ] },
                    { "type": "column", "attrs": { "id": "admin-col-2", "background": "" }, "content": [
                        { "type": "highlight", "attrs": { "id": "admin-room", "small": true, "emoji": "%F0%9F%8F%A2", "color": "", "background": "var(--palette-bg-2)", "border": "var(--palette-border-2)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "会议室：预约规则、超时与无故占用处理" } ] } ] }
                    ] }
                ] },
                { "type": "list", "attrs": { "id": "admin-list-1" }, "content": [
                    { "type": "list_head", "attrs": { "id": "admin-list-1-1", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "访客接待与门禁管理" } ] },
                    { "type": "list_head", "attrs": { "id": "admin-list-1-2", "type": "todo", "checked": false, "opened": true }, "content": [ { "type": "text", "text": "公共区域保持整洁（茶水间、打印区）" } ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "admin-2" }, "content": [ { "type": "text", "text": "二、资产与安全" } ] },
                { "type": "columns", "attrs": { "id": "admin-cols-2", "colWidths": [400, 400] }, "content": [
                    { "type": "column", "attrs": { "id": "admin-col-3", "background": "" }, "content": [
                        { "type": "highlight", "attrs": { "id": "admin-asset-get", "small": true, "emoji": "%F0%9F%93%8D", "color": "", "background": "var(--palette-bg-3)", "border": "var(--palette-border-3)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "资产领用与归还：登记、保存、损坏处理" } ] } ] }
                    ] },
                    { "type": "column", "attrs": { "id": "admin-col-4", "background": "" }, "content": [
                        { "type": "highlight", "attrs": { "id": "admin-sec", "small": true, "emoji": "%F0%9F%94%92", "color": "", "background": "var(--palette-bg-5)", "border": "var(--palette-border-5)" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "信息安全：密码规范、外发资料审批、U盘管控" } ] } ] }
                    ] }
                ] },
                { "type": "header", "attrs": { "level": 1, "id": "admin-3" }, "content": [ { "type": "text", "text": "三、关键联系人与值班表" } ] },
                { "type": "table", "attrs": { "id": "admin-table-1" }, "content": [
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [160], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-h1" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "部门" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [220], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-h2" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "联系人" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [220], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-h3" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "电话 / IM" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [200], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-h4" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "marks": [ { "type": "strong" } ], "text": "值班时间" } ] } ] } ] }
                    ] },
                    { "type": "table_row", "content": [
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [160], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-r1c1" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "行政" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [220], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-r1c2" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "王敏" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [220], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-r1c3" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "010-123456 / Feishu" } ] } ] } ] },
                        { "type": "table_cell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": [200], "background": "" }, "content": [ { "type": "textBlock", "attrs": { "id": "admin-t-r1c4" }, "content": [ { "type": "textBlock_head", "attrs": { "id": "" }, "content": [ { "type": "text", "text": "工作日 9:00-18:00" } ] } ] } ] }
                    ] }
                ] }
            ] }
        ]
    }
};


