import i18next from 'i18next';

export const projectManagement = {
    title: i18next.t('template.projectManagement'), 
    emoji: '',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop',
    image: 'https://res.cloudinary.com/dybz0bvui/image/upload/v1756971321/projectMs_s5ukkv.png',
    collectionMap: {
        "2g94kZFBhp-4vFOGitxXa": {
            "schema": {
                "viewId": "defaultView",
                "views": [
                    {
                        "id": "defaultView",
                        "name": "默认列表视图",
                        "type": "grid",
                        "columnsConfig": [
                            {
                                "id": "defaultColumnText",
                                "hidden": false
                            },
                            {
                                "id": "HLIiNm5W",
                                "hidden": false
                            },
                            {
                                "id": "defaultColumnNumber",
                                "hidden": false
                            },
                            {
                                "id": "defaultColumnDate",
                                "hidden": false
                            },
                            {
                                "id": "iu9tlivw",
                                "hidden": false
                            },
                            {
                                "id": "nkcb-vAZ",
                                "hidden": false
                            },
                            {
                                "id": "hjKdPP4L",
                                "hidden": false
                            }
                        ],
                        "cardConfig": {},
                        "groupBy": {
                            "columnId": "HLIiNm5W"
                        }
                    },
                    {
                        "id": "G4abgfdO",
                        "type": "gallery",
                        "name": "Gallery",
                        "columnsConfig": [
                            {
                                "id": "defaultColumnText",
                                "hidden": false
                            },
                            {
                                "id": "defaultColumnNumber",
                                "hidden": false
                            },
                            {
                                "id": "defaultColumnDate",
                                "hidden": false
                            },
                            {
                                "id": "iu9tlivw",
                                "hidden": false
                            },
                            {
                                "id": "nkcb-vAZ",
                                "hidden": false
                            },
                            {
                                "id": "hjKdPP4L",
                                "hidden": false
                            },
                            {
                                "id": "HLIiNm5W",
                                "hidden": false
                            }
                        ],
                        "cardConfig": {}
                    }
                ],
                "columns": [
                    {
                        "id": "defaultColumnText",
                        "type": "text",
                        "title": "任务描述",
                        "width": 180,
                        "config": {}
                    },
                    {
                        "id": "defaultColumnNumber",
                        "type": "select",
                        "title": "进展",
                        "width": 110,
                        "config": {
                            "options": [
                                {
                                    "label": "待开始",
                                    "value": "qkxXR5XV",
                                    "color": "--N200"
                                },
                                {
                                    "label": "进行中",
                                    "value": "kTA7HrW5",
                                    "color": "--W100"
                                },
                                {
                                    "label": "已完成",
                                    "value": "WtIPqIzJ",
                                    "color": "--G200"
                                },
                                {
                                    "label": "已停止",
                                    "value": "m0-tWd6C",
                                    "color": "--R200"
                                }
                            ]
                        }
                    },
                    {
                        "id": "defaultColumnDate",
                        "type": "date",
                        "title": "开始日期",
                        "width": 121,
                        "config": {
                            "format": "M/D/YYYY"
                        }
                    },
                    {
                        "id": "iu9tlivw",
                        "title": "预计完成日期",
                        "width": 150,
                        "type": "date",
                        "config": {
                            "format": "M/D/YYYY"
                        }
                    },
                    {
                        "id": "nkcb-vAZ",
                        "title": "是否延期",
                        "width": 129,
                        "type": "select",
                        "config": {
                            "options": [
                                {
                                    "label": "正常",
                                    "value": "YL3CAv8g",
                                    "color": "--G200"
                                },
                                {
                                    "label": "延期",
                                    "value": "vbMEbzPo",
                                    "color": "--R200"
                                }
                            ]
                        }
                    },
                    {
                        "id": "hjKdPP4L",
                        "title": "实际完成日期",
                        "width": 153,
                        "type": "date",
                        "config": {
                            "format": "M/D/YYYY"
                        }
                    },
                    {
                        "id": "HLIiNm5W",
                        "title": "重要紧急程度",
                        "width": 180,
                        "type": "select",
                        "config": {
                            "options": [
                                {
                                    "label": "重要紧急",
                                    "value": "QWpMTIJD",
                                    "color": "--R200"
                                },
                                {
                                    "label": "紧急不重要",
                                    "value": "P6h4NwvH",
                                    "color": "--O200"
                                },
                                {
                                    "label": "重要不紧急",
                                    "value": "-NQODA9O",
                                    "color": "--Y300"
                                },
                                {
                                    "label": "不紧急不重要",
                                    "value": "VWZYYpxy",
                                    "color": "--G100"
                                }
                            ]
                        }
                    }
                ]
            },
            "values": [
                {
                    "id": "defaultId1",
                    "defaultColumnNumber": [
                        "qkxXR5XV"
                    ],
                    "defaultColumnText": "完成年度财务报告",
                    "defaultColumnDate": "Tue, 02 Sep 2025 06:08:22 GMT",
                    "iu9tlivw": "Wed, 10 Sep 2025 06:08:41 GMT",
                    "nkcb-vAZ": [
                        "YL3CAv8g"
                    ],
                    "hjKdPP4L": "Mon, 08 Sep 2025 06:09:21 GMT",
                    "HLIiNm5W": [
                        "QWpMTIJD"
                    ]
                },
                {
                    "id": "defaultId2",
                    "defaultColumnNumber": [
                        "kTA7HrW5"
                    ],
                    "defaultColumnText": "组织年度员工团建活动",
                    "defaultColumnDate": "Tue, 16 Sep 2025 06:08:24 GMT",
                    "iu9tlivw": "Fri, 26 Sep 2025 06:08:42 GMT",
                    "nkcb-vAZ": [
                        "vbMEbzPo"
                    ],
                    "hjKdPP4L": "Mon, 08 Sep 2025 06:09:19 GMT",
                    "HLIiNm5W": [
                        "P6h4NwvH"
                    ]
                },
                {
                    "id": "defaultId3",
                    "defaultColumnNumber": [
                        "WtIPqIzJ"
                    ],
                    "defaultColumnText": "更新公司网站",
                    "defaultColumnDate": "Wed, 17 Sep 2025 06:08:26 GMT",
                    "iu9tlivw": "Sat, 27 Sep 2025 06:08:45 GMT",
                    "nkcb-vAZ": [
                        "YL3CAv8g"
                    ],
                    "hjKdPP4L": "Mon, 01 Sep 2025 06:09:23 GMT",
                    "HLIiNm5W": [
                        "-NQODA9O"
                    ]
                },
                {
                    "id": "HvknKXUt",
                    "defaultColumnText": "招聘员工",
                    "defaultColumnNumber": [
                        "kTA7HrW5"
                    ],
                    "defaultColumnDate": "Fri, 26 Sep 2025 06:08:27 GMT",
                    "iu9tlivw": "Fri, 26 Sep 2025 06:08:47 GMT",
                    "nkcb-vAZ": [
                        "YL3CAv8g"
                    ],
                    "hjKdPP4L": "Mon, 01 Sep 2025 06:09:27 GMT",
                    "HLIiNm5W": [
                        "VWZYYpxy"
                    ]
                },
                {
                    "id": "F3ZV5x3x",
                    "defaultColumnText": "开发新产品",
                    "defaultColumnNumber": [
                        "WtIPqIzJ"
                    ],
                    "defaultColumnDate": "Mon, 22 Sep 2025 06:08:29 GMT",
                    "iu9tlivw": "Tue, 30 Sep 2025 06:08:49 GMT",
                    "nkcb-vAZ": [
                        "vbMEbzPo"
                    ],
                    "hjKdPP4L": "Mon, 01 Sep 2025 06:09:30 GMT",
                    "HLIiNm5W": [
                        "QWpMTIJD"
                    ]
                },
                {
                    "id": "7PwIrdtH",
                    "defaultColumnText": "客户满意度调查",
                    "defaultColumnNumber": [
                        "qkxXR5XV"
                    ],
                    "defaultColumnDate": "Wed, 17 Sep 2025 06:08:31 GMT",
                    "iu9tlivw": "Tue, 30 Sep 2025 06:08:51 GMT",
                    "nkcb-vAZ": [
                        "YL3CAv8g"
                    ],
                    "hjKdPP4L": "Tue, 23 Sep 2025 06:09:44 GMT",
                    "HLIiNm5W": [
                        "QWpMTIJD"
                    ]
                },
                {
                    "id": "-CLyODBe",
                    "defaultColumnText": "供应链优化",
                    "defaultColumnNumber": [
                        "kTA7HrW5"
                    ],
                    "defaultColumnDate": "Thu, 11 Sep 2025 06:08:33 GMT",
                    "iu9tlivw": "Tue, 30 Sep 2025 06:08:52 GMT",
                    "nkcb-vAZ": [
                        "YL3CAv8g"
                    ],
                    "hjKdPP4L": "Mon, 15 Sep 2025 06:09:46 GMT",
                    "HLIiNm5W": [
                        "P6h4NwvH"
                    ]
                },
                {
                    "id": "Xz912wpa",
                    "defaultColumnText": "确定年度目标",
                    "defaultColumnNumber": [
                        "qkxXR5XV"
                    ],
                    "defaultColumnDate": "Tue, 16 Sep 2025 06:08:36 GMT",
                    "iu9tlivw": "Tue, 23 Sep 2025 06:08:56 GMT",
                    "nkcb-vAZ": [
                        "YL3CAv8g"
                    ],
                    "hjKdPP4L": "Wed, 10 Sep 2025 06:09:48 GMT",
                    "HLIiNm5W": [
                        "-NQODA9O"
                    ]
                },
                {
                    "id": "csgFqMsI",
                    "defaultColumnText": "新员工培训",
                    "defaultColumnNumber": [
                        "m0-tWd6C"
                    ],
                    "defaultColumnDate": "Fri, 12 Sep 2025 06:08:38 GMT",
                    "iu9tlivw": "Tue, 30 Sep 2025 06:08:54 GMT",
                    "nkcb-vAZ": [
                        "vbMEbzPo"
                    ],
                    "hjKdPP4L": "Sun, 07 Sep 2025 06:09:51 GMT",
                    "HLIiNm5W": [
                        "P6h4NwvH"
                    ]
                }
            ]
        },
    },
    content: {
        "type": "doc",
        "content": [
            {
                "type": "title",
                "attrs": {
                    "id": "4LL26zec",
                    "placeholder": ""
                },
                "content": [
                    {
                        "type": "text",
                        "text": "任务管理"
                    }
                ]
            },
            {
                "type": "body",
                "content": [
                    {
                        "type": "collection",
                        "attrs": {
                            "id": "2g94kZFBhp-4vFOGitxXa"
                        }
                    },
                ]
            }
        ]
    }, 
};