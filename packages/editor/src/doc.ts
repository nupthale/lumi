import { nanoid } from 'nanoid';

import { schema } from './Editor/plugins/schema';
import { MentionTypeEnum } from './Editor/interface';
import { ListTypeEnum } from './Editor/plugins/nodes/list/interface';

const LIST_TYPE = ListTypeEnum.ORDERED;

export const defaultDoc = {
    "type": "doc",
    "content": [
        {
            "type": "title",
            "attrs": {
                "id": nanoid(8),
                "placeholder": "请输入标题"
            },
        },
        {
            "type": "body",
            "content": [
                {
                    "type": "textBlock",
                    "attrs": {
                        "id": nanoid(8)
                    },
                    "content": [
                        {
                            "type": "textBlock_head",
                            "attrs": {
                                "id": nanoid(8)
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

export const doc = [
    schema.node('title', { id: nanoid(8) }, [
        schema.node('emoji', {}, [schema.text('👨')]), 
        schema.node('emoji', {}, [schema.text('👩')]), 
        schema.text('合同操作手册大全'), 
        schema.node('emoji', {}, [schema.text('👧')]), 
        schema.node('emoji', {}, [schema.text('👦')]),
    ]),
    schema.node('body', null, [
        schema.node('textBlock', { id: nanoid(8) }, [
                schema.node('textBlock_head', {
                    id: nanoid(8),
                }, [
                    schema.text('欢迎使用合同管理系统！', [
                        schema.mark('comment', { id: 'refId1' }),
                    ]),
                    schema.text('本系统是一站式合同管理解决方案，致力于提供高效、安全、便捷的合同全生命周期管理。无论您是合同申请人、审批人还是管理员，都能在这里找到所需的操作指引。通过数字化、智能化的流程设计，'),
                    schema.text('帮助您轻松完成合同的创建、审批、执行和管理工作。让我们开始探索系统的核心功能吧！', [
                        schema.mark('comment', { id: 'refId2' }),
                    ]),
                ]),
            ],
        ),
        schema.node('header', { level: 1, id: nanoid(8) }, [schema.node('emoji', {}, [schema.text('💡')]), schema.text('操作指南')]),
        schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [
                schema.text('本手册旨在帮助用户快速了解和使用合同管理系统。系统采用全新的界面设计，提供直观的操作流程和清晰的功能分类。'),
                schema.node('mention', { id: nanoid(8), type: MentionTypeEnum.USER, name: 'Leona Wang'  }, []),
                schema.text('可以通过左侧导航栏快速访问各个模块，通过顶部搜索框查找特定合同。系统支持批量操作和快捷键，极大提升工作效率。')
            ]),
        ]),

        schema.node('header', { level: 2, id: nanoid(8) }, [schema.node('emoji', {}, [schema.text('✅')]), schema.text(' 合同申请篇')]),
        schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [
                schema.text('合同申请是整个流程的起点。首先，在"新建合同"页面选择合同类型，填写基本信息包括：合同名称、合作方、合同金额等。系统提供智能模板推荐，您可以选择合适的模板快速生成合同文本。填写完成后，系统会自动进行格式检查，确保信息完整准确。最后点击"提交申请"，将合同送至审批流程。')
            ]),
        ]),

        schema.node('header', { level: 2, id: nanoid(8) }, [schema.node('emoji', {}, [schema.text('✅')]), schema.text(' 合同审批篇')]),
        schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [
                schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
            ])
        ]),

        schema.node('header', { level: 2, id: nanoid(8) }, [schema.node('emoji', {}, [schema.text('✅')]), schema.text(' 合同管理篇')]),
        schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [
                schema.text('合同管理模块提供全生命周期管理功能。您可以在"合同列表"中查看所有合同状态，支持多维度筛选和排序。系统自动跟踪合同履行情况，到期前会发送提醒通知。重要节点如付款、交付等都可以设置提醒。同时，提供合同文档的在线预览、下载和归档功能，方便日常管理和查询。')
            ])
        ]),
        schema.node('header', { level: 1, id: nanoid(8) }, [schema.node('emoji', {}, [schema.text('🎬')]), schema.text(' 视频专区'), schema.node('mention', { id: nanoid(8), type: MentionTypeEnum.USER, name: '韩雪'  }), schema.text(' ')]),
        schema.node('header', { level: 2, id: nanoid(8) }, [schema.node('emoji', {}, [schema.text('❓')]), schema.text(' 热门问题')]),
        schema.node('highlight', { id: nanoid(8) }, [schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [
                schema.text('为了帮助您更好地使用系统，我们收集整理了用户最常遇到的问题和解决方案。包括合同模板的选择与使用、审批流程的设置与调整、系统权限的申请与变更等。如果您在使用过程中遇到任何问题，都可以先查看这里。我们会定期更新这些内容，确保您获得最新的帮助信息。')
            ]),
        ])]),
        
        schema.node(
            'list',
            { id: nanoid(8) }, 
            [
                schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                    schema.text('系统登录与权限：介绍系统登录方式、账号管理、权限申请流程。新用户首次使用需完成实名认证，确保操作安全。系统支持单点登录，方便快捷。')
                ]),
            ]
        ),
        schema.node(
            'list',
            { id: nanoid(8) }, 
            [
                schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                    schema.text('合同模板管理')
                ]),
                schema.node('list_body', { id: nanoid(8) }, [
                    schema.node(
                        'list',
                        { id: nanoid(8) }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                                schema.text('模板库使用：系统内置多种标准合同模板，支持按行业、类型筛选。用户可预览、下载和使用模板，也可基于模板进行个性化修改。')
                            ]),
                        ]
                    ),
                ]),
            ]
        ),
        schema.node(
            'list',
            { id: nanoid(8) }, 
            [
                schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                    schema.text('合同审批流程')
                ]),
                schema.node('list_body', { id: nanoid(8) }, [
                    schema.node(
                        'list',
                        { id: nanoid(8) }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                                schema.text('提交审批：选择审批流程模板，设置审批人员和审批顺序。系统支持条件审批，可根据合同金额自动匹配审批层级。', [
                                    schema.mark('background', { color: '#fed4a4cc' }),
                                    schema.mark('color', { color: '#de7802' }),
                                ])
                            ]),
                        ]
                    ),
                    schema.node(
                        'list',
                        { id: nanoid(8) }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                                schema.text('审批操作：审批人收到待办提醒后，可在线查看合同详情，添加审批意见，进行同意或退回操作。支持批量审批，提高效率。')
                            ]),
                        ]
                    ),
                ]),
            ]
        ),
        schema.node(
            'list',
            { id: nanoid(8) }, 
            [
                schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                    schema.text('审批', [])
                ]),
                schema.node('list_body', { id: nanoid(8) }, [
                    schema.node(
                        'list',
                        { id: nanoid(8) }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                                schema.text('审批进度跟踪：系统提供可视化的审批进度展示，清晰显示当前审批环节和处理人。申请人可实时查看审批状态，收到审批结果通知。')
                            ]),
                            schema.node('list_body', { id: nanoid(8) }, [
                                schema.node(
                                    'list',
                                    { id: nanoid(8) }, 
                                    [
                                        schema.node('list_head', { id: nanoid(8), type: LIST_TYPE }, [
                                            schema.text('审批记录查询：支持查看历史审批记录，包含审批人、审批时间、审批意见等详细信息。可导出审批日志，方便归档和追溯。')
                                        ]),
                                    ]
                                ),
                            ])
                        ]
                    ),
                ]),
            ]
        ),

        schema.node(
            'list',
            { id: nanoid(8), type: ListTypeEnum.TODO }, 
            [
                schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TODO }, [
                    schema.text('审批', [])
                ]),
                schema.node('list_body', { id: nanoid(8) }, [
                    schema.node(
                        'list',
                        { id: nanoid(8) }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TODO }, [
                                schema.text('审批进度跟踪：系统提供可视化的审批进度展示，清晰显示当前审批环节和处理人。申请人可实时查看审批状态，收到审批结果通知。')
                            ]),
                            schema.node('list_body', { id: nanoid(8) }, [
                                schema.node(
                                    'list',
                                    { id: nanoid(8) }, 
                                    [
                                        schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TODO }, [
                                            schema.text('审批记录查询：支持查看历史审批记录，包含审批人、审批时间、审批意见等详细信息。可导出审批日志，方便归档和追溯。')
                                        ]),
                                    ]
                                ),
                            ])
                        ]
                    ),
                ]),
            ]
        ),

        schema.node(
            'list',
            { id: nanoid(8), type: ListTypeEnum.TOGGLE }, 
            [
                schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                    schema.text('审批', [])
                ]),
                schema.node('list_body', { id: nanoid(8) }, [
                    schema.node(
                        'list',
                        { id: nanoid(8) }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                schema.text('审批进度跟踪：系统提供可视化的审批进度展示，清晰显示当前审批环节和处理人。申请人可实时查看审批状态，收到审批结果通知。')
                            ]),
                            schema.node('list_body', { id: nanoid(8) }, [
                                schema.node(
                                    'list',
                                    { id: nanoid(8) }, 
                                    [
                                        schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                            schema.text('审批记录查询：支持查看历史审批记录，包含审批人、审批时间、审批意见等详细信息。可导出审批日志，方便归档和追溯。')
                                        ]),
                                    ]
                                ),
                            ])
                        ]
                    ),
                ]),
            ]
        ),

        schema.node('image', {
            id: nanoid(8),
            src: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1745558441/vyqxdmsaobxdkfoid2mh.jpg',
        }),

        schema.node('video', {
            id: nanoid(8),
        }),

        schema.node('iframe', {
            id: nanoid(8),
            src: '',
        }, []),

        schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [
                schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
            ])
        ]),

        schema.node('coder', {
            id: nanoid(8),
            language: 'javascript',
        }, [
            schema.text('const hello = "world";'),
        ]),

        schema.node('columns', {
            id: nanoid(8),
            colWidths: [400, 400],
        }, [
            schema.node('column', { id: nanoid(8) }, [
                schema.node(
                    'list',
                    { id: nanoid(8), type: ListTypeEnum.TOGGLE }, 
                    [
                        schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                            schema.text('审批', [])
                        ]),
                        schema.node('list_body', { id: nanoid(8) }, [
                            schema.node(
                                'list',
                                { id: nanoid(8) }, 
                                [
                                    schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                        schema.text('审批进度跟踪：系统提供可视化的审批进度展示，清晰显示当前审批环节和处理人。申请人可实时查看审批状态，收到审批结果通知。')
                                    ]),
                                    schema.node('list_body', { id: nanoid(8) }, [
                                        schema.node(
                                            'list',
                                            { id: nanoid(8) }, 
                                            [
                                                schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                                    schema.text('审批记录查询：支持查看历史审批记录，包含审批人、审批时间、审批意见等详细信息。可导出审批日志，方便归档和追溯。')
                                                ]),
                                            ]
                                        ),
                                    ])
                                ]
                            ),
                        ]),
                    ]
                ),
            ]),
            schema.node('column', { id: nanoid(8) }, [
                schema.node('textBlock', { id: nanoid(8) }, [
                    schema.node('textBlock_head', {
                        id: nanoid(8),
                    }, [
                        schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
                    ])
                ]),
            ]),
        ]),

        schema.node('table', { id: nanoid(8) }, [
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), rowspan: 2, colspan: 2, colwidth: [400, 400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [
                            schema.text('项目名称'),
                        ])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node(
                        'list',
                        { id: nanoid(8), type: ListTypeEnum.TOGGLE }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                schema.text('审批', [])
                            ]),
                            schema.node('list_body', { id: nanoid(8) }, [
                                schema.node(
                                    'list',
                                    { id: nanoid(8) }, 
                                    [
                                        schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                            schema.text('审批进度跟踪：系统提供可视化的审批进度展示，清晰显示当前审批环节和处理人。申请人可实时查看审批状态，收到审批结果通知。')
                                        ]),
                                        schema.node('list_body', { id: nanoid(8) }, [
                                            schema.node(
                                                'list',
                                                { id: nanoid(8) }, 
                                                [
                                                    schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                                        schema.text('审批记录查询：支持查看历史审批记录，包含审批人、审批时间、审批意见等详细信息。可导出审批日志，方便归档和追溯。')
                                                    ]),
                                                ]
                                            ),
                                        ])
                                    ]
                                ),
                            ]),
                        ]
                    ),
                ]),
            ]),
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {}, [
                            schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
                        ])
                    ])  
                ])
            ]),
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [
                            schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
                        ])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [])
                    ]),
                ]),
            ]),

        ]),

        // table
        schema.node('table', { id: nanoid(8) }, [
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), rowspan: 2, colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [
                            schema.text('项目名称'),
                        ])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node(
                        'list',
                        { id: nanoid(8), type: ListTypeEnum.TOGGLE }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                schema.text('审批', [])
                            ]),
                            schema.node('list_body', { id: nanoid(8) }, [
                                schema.node(
                                    'list',
                                    { id: nanoid(8) }, 
                                    [
                                        schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                            schema.text('审批进度跟踪：系统提供可视化的审批进度展示，清晰显示当前审批环节和处理人。申请人可实时查看审批状态，收到审批结果通知。')
                                        ]),
                                        schema.node('list_body', { id: nanoid(8) }, [
                                            schema.node(
                                                'list',
                                                { id: nanoid(8) }, 
                                                [
                                                    schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                                        schema.text('审批记录查询：支持查看历史审批记录，包含审批人、审批时间、审批意见等详细信息。可导出审批日志，方便归档和追溯。')
                                                    ]),
                                                ]
                                            ),
                                        ])
                                    ]
                                ),
                            ]),
                        ]
                    ),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [])
                    ]),
                ]),
            ]),
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {}, [
                            schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
                        ])
                    ])  
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {}, [])
                    ])  
                ])
            ]),
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), colspan: 3, background: 'rgba(254, 212, 164, 0.8)', colwidth: [400, 400, 400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [
                            schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
                        ])
                    ]),
                ]),
            ]),
        ]),

         // table
         schema.node('table', { id: nanoid(8) }, [
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), rowspan: 1, colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [
                            schema.text('项目名称'),
                        ])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node(
                        'list',
                        { id: nanoid(8), type: ListTypeEnum.TOGGLE }, 
                        [
                            schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                schema.text('审批', [])
                            ]),
                            schema.node('list_body', { id: nanoid(8) }, [
                                schema.node(
                                    'list',
                                    { id: nanoid(8) }, 
                                    [
                                        schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                            schema.text('审批进度跟踪：系统提供可视化的审批进度展示，清晰显示当前审批环节和处理人。申请人可实时查看审批状态，收到审批结果通知。')
                                        ]),
                                        schema.node('list_body', { id: nanoid(8) }, [
                                            schema.node(
                                                'list',
                                                { id: nanoid(8) }, 
                                                [
                                                    schema.node('list_head', { id: nanoid(8), type: ListTypeEnum.TOGGLE }, [
                                                        schema.text('审批记录查询：支持查看历史审批记录，包含审批人、审批时间、审批意见等详细信息。可导出审批日志，方便归档和追溯。')
                                                    ]),
                                                ]
                                            ),
                                        ])
                                    ]
                                ),
                            ]),
                        ]
                    ),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [])
                    ]),
                ]),
            ]),
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {}, [
                            schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
                        ])
                    ])  
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {}, [])
                    ])  
                ])
            ]),
            schema.node('table_row', { id: nanoid(8) }, [
                schema.node('table_cell', { id: nanoid(8), colwidth: [400], background: 'rgba(254, 212, 164, 0.8)' }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [
                            schema.text('合同审批采用多级审核机制。审批人在"待办事项"中可以查看待审批的合同，系统会通过消息提醒及时通知。审批时可以直接在线查看合同内容，支持批注和修改建议。如需调整，可将合同退回申请人修改。审批通过后，系统自动通知下一级审批人，确保流程顺畅进行。')
                        ])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [
                            schema.text('123')
                        ])
                    ]),
                ]),
                schema.node('table_cell', { id: nanoid(8), colwidth: [400] }, [
                    schema.node('textBlock', { id: nanoid(8) }, [
                        schema.node('textBlock_head', {
                            id: nanoid(8),
                        }, [])
                    ]),
                ]),
            ]),
        ]),
    ]),
];

export const docComments = {
    'refId1': ['commentId1', 'commentId2'],
    'refId2': ['commentId3', 'commentId4'],
};

export const commentInfoMap = {
    'commentId1': {
        id: 'commentId1',
        refDoc: '任务处理',
        comments: [
            { id: '1', user: '王凯', content: '思维 理念 成长 搜集 完美', createTime: '2022-01-01' },
            { id: '2', user: '小米', content: '感谢！分享我的结果～是「学习专注追求竞争回顾」，且战略思维最高，影响力其次。', createTime: '2022-01-02' },
            { id: '3', user: 'Adam', content: '感觉重合度很高hhh 😂', createTime: '2022-01-02' },
        ],
    },
    'commentId2': {
        id: 'commentId2',
        refDoc: '任务处理',
        comments: [
            { id: '1', user: '张瑞', content: '很好的案例~', createTime: '2022-01-01' },
            { id: '2', user: '李先森', content: '期待你的成果，🥳', createTime: '2022-01-02' },
            { id: '3', user: 'Adam', content: '建立个人知识库Wiki， 沉淀个人思考', createTime: '2022-01-02' },
        ],
    },
    'commentId3': {
        id: 'commentId3',
        refDoc: '触发任务详情的展示。',
        comments: [
            { id: '1', user: '陈明宇', content: '这个功能设计得很合理，提高了操作效率', createTime: '2022-01-01' },
            { id: '2', user: '林思远', content: '建议可以增加批量处理的功能，对于大量任务会更方便', createTime: '2022-01-02' },
            { id: '3', user: '张雨晴', content: '界面交互很流畅，使用体验不错 👍', createTime: '2022-01-02' },
        ],
    },
    'commentId4': {
        id: 'commentId4',
        refDoc: '触发任务详情的展示。',
        comments: [
            { id: '1', user: '赵子涵', content: '产品体验越来越好了，期待后续更新 🎉', createTime: '2022-01-01' },
            { id: '2', user: '吴思琪', content: '操作流程简单直观，新手也能快速上手', createTime: '2022-01-02' },
            { id: '3', user: '刘天成', content: '希望能增加一些快捷键支持，提升效率 ⌨️', createTime: '2022-01-02' },
        ],
    },
};

export const mockUsers = [
    { id: '1', name: '王凯' },
    { id: '2', name: '张雨晴' },
    { id: '3', name: '李思琪' },
    { id: '4', name: '刘天成' },
    { id: '5', name: '陈明宇' },
];