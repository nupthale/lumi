import { computed, ref } from "vue";
import { useSubscription } from "@vueuse/rxjs";
import { tap } from "rxjs";
import { openAutocomplete, closeAutocomplete } from 'prosemirror-autocomplete';

import { 
    Type, 
    Heading1, 
    Heading2, 
    Heading3, 
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    ListTodo,
    ListCollapse,
    Image, 
    Video,
    Code,
    Highlighter,
    Globe,
    Columns2,
    Columns3,
    Columns4,
    Table,
    Sheet,
    Quote,
} from 'lucide-vue-next';

import { contextStore } from '@editor/Editor/store/context';
import { autoCompleteActionUpdate$, autoCompleteOpen$, autoCompleteUp$, autoCompleteDown$, autoCompleteFilter$, autoCompleteEnter$, showPopover$ } from '../../event';
import { ListTypeEnum } from '@editor/Editor/plugins/nodes/list/interface';
import { PopoverTypeEnum } from '@editor/Editor/interface';
import { useAddBlock } from '@editor/Editor/components/FloatingMenu/useAddBlock';

import { getTopNode } from '@editor/Editor/shared/index';

import { picker } from '../../plugins/core/autocomplete';

interface MenuItemType {
    name: string;
    inline?: boolean;
    icon: any;
    iconWidth?: number;
    iconColor?: string;
    type: string;
    matches: string[];
    attrs?: any;
    index?: number;
}

interface MenuType {
    group: string;
    items: MenuItemType[];
}

const menus: MenuType[] = [
    {
        group: '常用',
        items: [
            { name: '表情', inline: true, icon: '😀', type: 'emoji', matches: ['表情', 'biaoqing', 'emoji'] },
        ]
    },
    {
        group: '基础',
        items: [
            { name: '文本', icon: Type, type: 'textBlock', matches: ['文本', 'wenben', 'text'] },
            { name: '一级标题', icon: Heading1, iconWidth: 24, type: 'header', attrs: { level: 1 }, matches: ['一级标题', 'yijibiaoti', 'header1', 'h1'] },
            { name: '二级标题', icon: Heading2, iconWidth: 24, type: 'header', attrs: { level: 2 }, matches: ['二级标题', 'erjibiaoti', 'header2', 'h2'] },
            { name: '三级标题', icon: Heading3, iconWidth: 24, type: 'header', attrs: { level: 3 }, matches: ['三级标题', 'sanjibiaoti', 'header3', 'h3'] },
            { name: '四级标题', icon: Heading4, iconWidth: 24, type: 'header', attrs: { level: 4 }, matches: ['四级标题', 'sijibiaoti', 'header4', 'h4'] },
            { name: '五级标题', icon: Heading5, iconWidth: 24, type: 'header', attrs: { level: 5 }, matches: ['五级标题', 'wujibiaoti', 'header5', 'h5'] },
            { name: '六级标题', icon: Heading6, type: 'header', attrs: { level: 6 }, matches: ['六级标题', 'liujibiaoti', 'header6', 'h6'] },
            { name: '无序列表', icon: List, iconWidth: 24, type: 'list', attrs: { type: ListTypeEnum.BULLET }, matches: ['无序列表', 'wuxuliebiao', 'bullet', 'ul'] },
            { name: '有序列表', icon: ListOrdered, iconWidth: 24, type: 'list', attrs: { type: ListTypeEnum.ORDERED }, matches: ['有序列表', 'youxuliebiao', 'ordered', 'ol'] },
            { name: '任务列表', icon: ListTodo, iconWidth: 22, type: 'list', attrs: { type: ListTypeEnum.TODO }, matches: ['任务列表', 'renwuliebiao', 'todo', 'ol'] },
            { name: '折叠列表', icon: ListCollapse, iconWidth: 22, type: 'list', attrs: { type: ListTypeEnum.TOGGLE }, matches: ['折叠列表', 'zhedieliebiao', 'toggle', 'ol'] },
            { name: '代码块', icon: Code, type: 'coder', matches: ['代码块', 'daimaikuai', 'code'] },
            { name: '引用', icon: Quote, iconWidth: 22, type: 'quote', matches: ['引用', 'yinyong', 'quote'] },
            { name: '高亮块', icon: Highlighter, type: 'highlight', matches: ['高亮块', 'gaoliangkuai', 'highlight'] },
        ]
    },
    {
        group: '媒体',
        items: [
            { name: '图片', icon: Image, iconColor: '#FF7237', type: 'image', matches: ['图片', 'tupian', 'image'] },
            { name: '视频', icon: Video, iconColor: '#25CB71', type: 'video', matches: ['视频', 'shipin', 'video'] },
            { name: '内嵌网页', icon: Globe, iconColor: '#874FFF', type: 'iframe', matches: ['内嵌网页', 'neiqianwangye', 'web', 'page', 'iframe'] },
        ]
    },
    {
        group: '布局',
        items: [
            { name: '表格', icon: Table, iconColor: '#00B6FF', type: 'table', matches: ['表格', 'biaoge', 'table'] },
            { name: '2栏布局', icon: Columns2, type: 'columns', attrs: { count: 2 }, matches: ['2栏布局', 'lianglanbuju', 'columns2', 'column2'] },
            { name: '3栏布局', icon: Columns3, type: 'columns', attrs: { count: 3 }, matches: ['3栏布局', 'sanlanbuju', 'columns3', 'column3'] },
            { name: '4栏布局', icon: Columns4, type: 'columns', attrs: { count: 4 }, matches: ['4栏布局', 'silanbuju', 'columns4', 'column4'] },
        ],
    },
    {
        group: '数据库',
        items: [
            { name: '数据库', icon: Sheet, iconColor: '#FF012A', type: 'collection', matches: ['数据库', 'shujuku', 'collection', 'table', 'sheet', 'gallery', 'kanban'] },
        ]
    }
];

const addIndex = (menus: any[]) => {
    // 给items加上index
    let index = 0;
    menus.forEach((item) => {
        item.items.forEach((item) => {
            item.index = index++;
        });
    });
}

export const useMenus = () => {
    const activeIndex = ref<number>(0);
    const filterText = ref<string>('');

    const scrollElRef = ref<HTMLDivElement | null>(null);
    const contentElRef = ref<HTMLDivElement>();

    const filteredMenus = computed(() => {
        if (!filterText.value?.length) {
            addIndex(menus);
            return menus;
        }

        let newMenus: MenuType[] = [];
        activeIndex.value = 0;

        menus.forEach((item) => {
            const items = item.items;
            const newItems: MenuItemType[] = [];

            items.filter((item) => {
                if (item.matches.some((match) => {
                    return match.includes(filterText.value);
                })) {
                    newItems.push({
                        ...item,
                    });
                }
            });

            if (newItems.length > 0) {
                newMenus.push({
                    ...item,
                    items: newItems,
                });
            }
        });

        addIndex(newMenus);

        return newMenus;
    });

    const filteredMenusLen = computed(() => {
        return filteredMenus.value.reduce((acc, crt) => {
            return acc + crt.items.length;
        }, 0);
    });

    const activeMenu = computed(() => {
        let menu;
        filteredMenus.value.forEach((item) => {
            item.items.forEach((menuItem) => {
                if (menuItem.index === activeIndex.value) {
                    menu = menuItem;
                }
            });
        });

        return menu;
    });

    const handleSelectMenu = (index) => {
        activeIndex.value = index;

        const action = picker.action;
        if (!action) return;

        closeAutocomplete(action.view);

        const { from, to } = action.range;
        const tr = action.view.state.tr;

        tr.setMeta('addToHistory', false);
        tr.deleteRange(from, to);
        action.view.dispatch(tr);

        autoCompleteEnter$.next();
    }

    const renderMenus = () => {
        return (
            <div class="w-[220px] doc-floatMenusContainer" ref={contentElRef} >
                {
                    filteredMenus.value.map((item) => {
                        return (
                            <div key={item.group}>
                                <div class="doc-floatMenu-title lightText">{item.group}</div>
                                <div class="my-2 mx-1">
                                    {
                                        item.items.map((item) => {
                                            return (
                                                <div 
                                                    class={[
                                                        'doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]',
                                                        activeIndex.value === item.index ? 'active' : '',
                                                    ]}
                                                    onClick={() => handleSelectMenu(item.index)}
                                                >
                                                    <div class="flex items-center">
                                                        <span class="mr-3 inline-flex items-center justify-center w-[24px] h-[24px]">
                                                            {
                                                                typeof item.icon === 'string' ? item.icon : (
                                                                    <item.icon width={(item.iconWidth || 20) - 4} height={(item.iconWidth || 20) - 4} color={item.iconColor || '#336df4'}></item.icon>
                                                                )
                                                            }
                                                        </span>
                                                        {item.name}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    const scrollToActiveItem = () => {
        if (!scrollElRef.value || !contentElRef.value) return;
        const activeItem = scrollElRef.value.querySelector('.active') as HTMLElement;

        if (!activeItem) return;
        // 判断activeItem是否在scrollEl元素的可视区域
        const scrollElRect = scrollElRef.value.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();
        const contentElRect = contentElRef.value.getBoundingClientRect();

        

        // 在不可见区域
        if (
            activeItemRect.top - scrollElRect.top > scrollElRect.height ||
            activeItemRect.top < scrollElRect.top
        ) {
            if (activeIndex.value === 0) {
                scrollElRef.value.scrollTop = 0;
            } else if (activeIndex.value === filteredMenusLen.value - 1) {
                scrollElRef.value.scrollTop = contentElRect.height - scrollElRect.height + 16;
            } else {
                // // 在上方不可见区域
                if (activeItemRect.top < scrollElRect.top) {
                    scrollElRef.value.scrollTop = (activeItemRect.top - contentElRect.top);
                } else {
                    scrollElRef.value.scrollTop += (activeItemRect.top - contentElRect.top) + scrollElRect.height - activeItemRect.height;
                }
            }
        }
    };

    useSubscription(
        autoCompleteOpen$.pipe(
            tap(() => {
                activeIndex.value = 0;
                filterText.value = '';
            }),
        ).subscribe()
    );

    useSubscription(
        autoCompleteUp$.pipe(
            tap(() => {
                if (activeIndex.value === 0) {
                    activeIndex.value = filteredMenusLen.value - 1;

                } else {
                    activeIndex.value--;
                }

                setTimeout(() => {
                    scrollToActiveItem();
                }, 0);
            }),
        ).subscribe()
    );

    useSubscription(
        autoCompleteDown$.pipe(
            tap(() => {
                if (activeIndex.value === filteredMenusLen.value - 1) {
                    activeIndex.value = 0;
                } else {
                    activeIndex.value++;
                }

                setTimeout(() => {
                    scrollToActiveItem();
                }, 0);
            }),
        ).subscribe()
    );

    useSubscription(
        autoCompleteFilter$.pipe(
            tap(({ filter: text }) => {
                filterText.value = text;
            }),
        ).subscribe()
    );

    const { addBlock, insertAfter } = useAddBlock();

    useSubscription(
        autoCompleteEnter$.pipe(
            tap(() => {
                if (!activeMenu.value) return;

                const editorView = contextStore.getState().editorView;
                if (!editorView) return;

                const { state } = editorView;
                const { schema } = state;
                const action = picker.action;

                if (!action) return;

                const { from } = action.range;

                if (activeMenu.value.type === 'emoji') {
                    showPopover$.next({
                        type: PopoverTypeEnum.EMOJI,
                        range: [from, from],
                    });
                    return;
                }

                // 判断from所在block，是否为空
                const resolvedPos = state.doc.resolve(from);
                const topNode = getTopNode(resolvedPos);

                if (topNode.textContent.trim() === '') {
                    addBlock(from, schema, schema.nodes[activeMenu.value.type], activeMenu.value.attrs || {});
                } else {
                    insertAfter(from, schema, schema.nodes[activeMenu.value.type], activeMenu.value.attrs || {});
                }
            }),
        ).subscribe()
    );

    return {
        scrollElRef,
        renderMenus,
        filteredMenusLen,
    };
}