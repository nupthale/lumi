<script lang="tsx">
import { defineComponent, toRef, computed, ref, watch } from 'vue';
import { Space, Tooltip, Dropdown, Menu, Input } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { cloneDeep } from 'lodash-es';
import { ArrowLeft, Plus, Ellipsis, Trash2, Menu as LucideMenu } from 'lucide-vue-next'; 
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import i18next from 'i18next';
import { Draggable } from '@he-tree/vue';
import { useLocalStorage, useEventListener } from '@vueuse/core';

import LogoSrc from '@/assets/logo.svg';
import LucideIcon from '@/components/LucideIcon/index.vue';
import { themeTokens } from '@/shared/theme';
import { useContextStore } from '@/store/ui-states/context';
import { queryClient } from '@/store/queries/client';
import { appBarHeight } from '@/shared/electron';

import { useWikiTree } from '@/store/queries/docs/useWikiTree';
import { useActions } from './hooks/useActions';
import DocOutlineIcon from '@/components/icons/DocOutlineIcon.vue';

const MenuItem = Menu.Item;

export default defineComponent({
    props: {
        wiki: Object,
    },
    setup(props) {
        const router = useRouter();
        const route = useRoute();

        const siderRef = ref();
        const siderCollapsed = useLocalStorage('wiki-siderCollapsed', false);

        const wikiIdRef = toRef(() => props.wiki?._id);

        const contextStore = useContextStore();
        const { crtSpace } = storeToRefs(contextStore);

        const { wikiTree } = useWikiTree(wikiIdRef);

        const clonedWikiTree = computed(() => {
            // 这里要clone是因为， 这个modelValue在tree组件里直接修改了， 不应该修改
            return wikiTree.value?.map(item => cloneDeep(item));
        });

        const wikiRef = toRef(props, 'wiki');

        const { handleAddDoc, handleDragStart, handleBeforeDragStart, handleAfterDrap, handleDeleteFile } = useActions(wikiRef, wikiTree);

        const fileIdRef = ref(route.params.fileId as string);

        // Watch for route param changes
        watch(() => route.params.fileId, (newId) => {
            fileIdRef.value = newId as string;
        });

        useEventListener(siderRef, 'mousedown', (e) => {
            e.stopPropagation();
        });

        const handleBack = () => {
            queryClient.invalidateQueries(['wikis', crtSpace.value]);

            router.replace('/wikis');
        }

        const handleClickTreeNode = (stat) => {
            fileIdRef.value = stat.data.file;

            if (!stat.data.type || stat.data.type === 'Doc') {
                router.replace(`/wikis/wiki/${props.wiki?._id}/doc/${stat.data.file}`)
            }
        }

        const renderAddBtn = (parent) => {
            return (
                <Dropdown trigger="click" placement="bottomLeft">
                    {{
                        default: () => (
                            <TextButton>
                                <Plus width={16} height={16} color={themeTokens.wikiSubTitleText()}></Plus>
                            </TextButton>
                        ),
                        overlay: () => (
                            <div style="width: 175px;">
                                <Menu
                                    class={['customMenu']}
                                    mode="inline"
                                    selectedKeys={[]}
                                >
                                    <MenuItem key="1" icon={<div class="docIcon"></div>} class="flex items-center" onClick={() => handleAddDoc(parent, wikiTree)}>
                                        {i18next.t('home.sider.doc')}
                                    </MenuItem>
                                </Menu>
                            </div>
                        )
                    }}
                </Dropdown>
            );
        }

        const renderFileAction = (parent) => {
            return (
                <div class="flex items-center gap-.5">
                    <Dropdown trigger="click" placement="bottomLeft">
                        {{
                            default: () => (
                                <TextButton>
                                    <Plus width={16} height={16} color={themeTokens.wikiSubTitleText()}></Plus>
                                </TextButton>
                            ),
                            overlay: () => (
                                <div style="width: 175px;">
                                    <Menu
                                        class={['customMenu']}
                                        mode="inline"
                                        selectedKeys={[]}
                                    >
                                        <MenuItem key="1" icon={<div class="docIcon"></div>} class="flex items-center" onClick={() => handleAddDoc(parent, wikiTree)}>
                                            {i18next.t('home.sider.doc')}
                                        </MenuItem>
                                    </Menu>
                                </div>
                            )
                        }}
                    </Dropdown>

                    <Dropdown trigger="click" placement="bottomLeft">
                        {{
                            default: () => (
                                <TextButton>
                                    <Ellipsis width={16} height={16} color={themeTokens.wikiSubTitleText()}></Ellipsis>
                                </TextButton>
                            ),
                            overlay: () => (
                                <div style="width: 175px;">
                                    <Menu
                                        class={['customMenu']}
                                        mode="inline"
                                        selectedKeys={[]}
                                    >
                                        <MenuItem key="1" icon={<Trash2 size={16} />} class="flex items-center" onClick={() => handleDeleteFile(parent)}>
                                            删除
                                        </MenuItem>
                                    </Menu>
                                </div>
                            )
                        }}
                    </Dropdown>
                </div>
            );
        }

        return () => (
            <div class={['wikiSider', siderCollapsed.value ? 'collapsed' : '']} ref={siderRef}>
                <div class="wiki relative">
                    <div style={{ paddingTop: `${appBarHeight}px` }}>
                        <div class="w-full flex items-center justify-between my-4">
                            <div class="flex items-center">
                                <TextButton onClick={handleBack} class="wikiSiderBackBtn">
                                    <ArrowLeft size={22} ></ArrowLeft>
                                </TextButton>
                                <div class="wiki_title ml-1 flex items-center">
                                    {props.wiki?.title || '-'}
                                </div>
                            </div>
                            
                            <Tooltip placement='right' title={siderCollapsed.value ? i18next.t('home.sider.expand') : i18next.t('home.sider.collapse')}>
                                <TextButton size="small" class={['foldIcon', globalThis.isElectron ? 'electron' : '']} onClick={() => siderCollapsed.value = !siderCollapsed.value}>
                                    <LucideMenu size={22}></LucideMenu>
                                </TextButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div class="mt-2 px-2 searchWrap">
                    <Input placeholder={i18next.t('home.main.searchPlaceholder')} style="width: 100%">
                        {{
                            addonBefore: () => (
                                <LucideIcon icon="Search" width={20} color="#646a73" />
                            )
                        }}
                    </Input>
                </div>

                <div class="mt-5 px-3.5">
                    <div class="mb-2 flex items-center justify-between">
                        <div class="subTitle">目录</div>
                        <div>
                            {renderAddBtn(null)}
                        </div>
                    </div>
                </div>

                <div class="px-2 flex-1">
                    <Draggable 
                        style="height: 100%;"
                        onClick:node={handleClickTreeNode} 
                        modelValue={clonedWikiTree.value} 
                        ref="tree" 
                        textKey="title" 
                        nodeKey={(stat) => stat.data.file}
                        ondragstart={handleDragStart}
                        onBeforeDragStart={handleBeforeDragStart}
                        onAfterDrop={handleAfterDrap}
                    >
                        {{
                            default: ({ node, stat }) => (
                                <div class={['treeNode', 'flex', 'items-center', 'justify-between', fileIdRef.value === node.file ? 'active' : '']} draggable onDragstart={handleDragStart}>
                                    <div class="flex-1 flex items-center">
                                        <div class="w-[32px]">
                                            {
                                                node.children?.length ? (
                                                    <TextButton class="ml-1 mr-2" onClick={() => stat.open = !stat.open}>
                                                        <svg style={{ 'transform': `rotate(${stat.open ? '90deg' : '0'})`}} width="10px" height="10px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="GlobalTrianglesmallOutlined"><path d="M17.933 11.2a1 1 0 0 1 0 1.6l-9.333 7A1 1 0 0 1 7 19V5a1 1 0 0 1 1.6-.8l9.333 7Z" fill="currentColor"></path></svg>
                                                    </TextButton>
                                                ) : ''
                                            }
                                        </div>
                                        
                                        {
                                            !node.emoji ? (
                                                <div class="docIcon"></div>
                                            ) : (
                                                node.emoji
                                            )
                                        }
                                        
                                        <div class="ml-2 truncate">{node.title || 'untitled'}</div>
                                    </div>
                                    <div class="fileAction">
                                        {renderFileAction(node)}
                                    </div>
                                </div>
                            )
                        }}
                    </Draggable>
                </div>
            </div>
        );
    }
})
</script>

<style>
</style>

<style scoped>
.wikiSiderBackBtn {
    width: 30px;
    height: 30px;
    margin-left: 4px;
}

:deep(.he-tree-drag-placeholder ) {
    border: 1px solid var(--primary-text-color);
    background: #76a4f22e;
    height: 35px;
    width: 100%;
    border-radius: 6px;
}

.wikiSider {
    display: flex;
    flex-direction: column;

    width: 298px;
    height: 100%;
    /* border-right: 1px solid var(--default-border-color); */
    background: var(--home-sider-bg);

    transition-duration: 200ms;
    transition-timing-function: ease;
    transition-property: width;
}

.wikiSider.collapsed {
    width: 0;
    overflow: hidden;
}

.wiki {
    position: relative;
    width: 100%;
    padding: 0 2px;

    transition: all .1s ease;
}

.wiki_title {
    font-weight: 600;
    font-size: 15px;
    line-height: 24px;
    letter-spacing: normal;
}

.wiki_titleIcon {
    width: 22px;
    height: 28px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.subTitle {
    font-size: 12px;
    color: var(--wiki-subTitle-color);
}

.docIcon {
    width: 16px;
    height: 16px;
    background: url('@/assets/doc-round.svg') no-repeat center;
    background-size: contain;
}

.fileAction {
    display: none;
}

.wikiSider :deep(.tree-node:hover .fileAction) {
    display: inline-flex;
}

.wikiSider :deep(.tree-node:hover) {
    background: none;
}

.wikiSider :deep(.tree-node:hover .treeNode) {
    background: var(--menu-item-hover);
    border-radius: 6px;
}

.treeNode {
    padding-right: 8px;
}

.treeNode.active {
    border-radius: 6px;
    font-weight: 500;
    background: var(--menu-active-bg)!important;
    color: var(--menu-active-text-color)!important;
}

.searchWrap {
  padding: 0 8px 0 8px;
}

.searchWrap :deep(.ant-input-group-addon) {
  background: var(--body-bg);
  padding-left: 6px;
  border-color: var(--float-border-color);
}

.searchWrap :deep(.ant-input) {
  background: var(--body-bg);
  border-color: var(--float-border-color);
  padding-left: 0;
  height: 32px;
  line-height: 32px;
  border-left: none;
}


.wikiSider.collapsed .foldIcon {
  left: 24px;
  top: 24px;
}

.wikiSider.collapsed .foldIcon.electron {
  top: 42px;
}

.foldIcon {
  padding: 1px;
  position: fixed;
  
  top: 19px;
  left: 258px;
  z-index: 100;
}

.foldIcon.electron {
  top: 40px; 
}
</style>