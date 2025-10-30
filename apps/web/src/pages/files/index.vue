<script lang="tsx">
import { defineComponent, ref, inject, watchEffect } from 'vue';
import type { Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, Dropdown, Menu, Tooltip } from 'ant-design-vue';
import { ChevronDown, Ellipsis, Trash2, Hash, Star, Blend, FilePlus2 } from 'lucide-vue-next';
import { TextButton, Loading, UserAvatar } from '@zsfe/zsui';
import { useRouter, RouterView } from 'vue-router';
import i18next from 'i18next';

import DocsEmptyIllustration from '@/components/icons/DocsEmptyIllustration.vue';
import { useFiles } from '@/store/queries/docs/useFiles';
import { useHomeStore } from '@/store/ui-states/home/index';

import { formatTime } from '@/shared/date';

import { useFileAction } from './useFileAction';
import { useContextStore } from '@/store/ui-states/context';
import { useUserStore } from '../../store/user';

export default defineComponent({
  setup(props) {
    const router = useRouter();

    const showFooterText = inject<Ref<boolean>>('showFooterText');

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const { files, isLoading } = useFiles(crtSpace);

    const homeStore = useHomeStore();
    const { selectedTag, onlyFavorites, searchText } = storeToRefs(homeStore);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const { handleAddEmptyDoc, handleDeleteFile, handleFavoriteClick, handleAddDocByTemplate } = useFileAction();

    const filteredFiles = ref([]);

    watchEffect(() => {
        const selectedTagId = selectedTag.value;
        if (!files.value) {
            filteredFiles.value = [];
        } else if (!searchText.value && !selectedTagId && !onlyFavorites.value) {
            filteredFiles.value = files.value;
        } else {
            filteredFiles.value = files.value.filter((file) => {
                let match = file.title?.toLowerCase().includes(searchText.value?.toLowerCase());

                if (selectedTagId) {
                    match = match && file.tags?.some((tag: string) => tag === selectedTagId);
                }

                if (onlyFavorites.value) {
                    match = match && file.favorite;
                }

                return match;
            });
        }
    });

    const handleDocClick = (file) => {
        router.replace(`/files/doc/${file._id}`);
    }

    const renderEmpty = () => {
        let text = onlyFavorites.value ? i18next.t('home.favorite.nodocs') : i18next.t('home.main.nodocs');

        if (searchText.value?.length) {
          text = i18next.t('home.main.searchNoResult');
        }

        return (
            <div class="docs-empty">
                <div class="docs-empty_illustration ">
                    <DocsEmptyIllustration />
                </div>
                <div class="docs-empty_text">
                    {text}
                </div>
            </div>
        );
    }

    const renderDocs = () => {

        if (!filteredFiles.value?.length && !isLoading.value) return renderEmpty();

        return filteredFiles.value?.map((file) => (
            <div class="list-row" onClick={() => handleDocClick(file)}>
                <div class="flex items-center">
                    <div class="mr-3 flex-shrink-0">
                        {
                            file.emoji ? (
                                <div class="docEmoji">{file.emoji}</div>
                            ) : (
                                <div class="docIcon"></div>
                            )
                        }
                    </div>

                    <div class="flex-1 overflow-hidden">
                        <div class="flex items-center">
                            { file.title || i18next.t('home.main.table.titlePlaceholder') }
                            <div class="flex items-center ml-1 mt-0.5">
                                {
                                    file.favorite ? (
                                        <Tooltip title={i18next.t('home.main.table.unfavorite')}>
                                            <TextButton onClick={(e) => handleFavoriteClick(e, file, false)}>
                                                <Star width="14px" height="14px" fill="#FFC60B" stroke="#FFC60B" />
                                            </TextButton>
                                        </Tooltip> 
                                    ) : (
                                        <Tooltip title={i18next.t('home.main.table.favorite')} class="doc-favoriteBtn">
                                            <TextButton onClick={(e) => handleFavoriteClick(e, file, true)}>
                                                <Star width="14px" height="14px" color="#646a73" />
                                            </TextButton>
                                        </Tooltip>
                                    )
                                }
                            </div>    
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex items-center gap-2 lightText">
                        <UserAvatar username={user.value?.name} showText={false} />
                        {user.value?.name}
                    </div>
                </div>
                <div class="lightText">{formatTime(file.updatedAt)}</div>
                <div class="text-right" onClick={e => e.stopPropagation()}>
                    <Dropdown placement="bottomRight" trigger="click">
                        {{
                            default: () => (
                                <TextButton>
                                    <Ellipsis strokeWidth="1" width="20px" />
                                </TextButton>
                            ),
                            overlay: () => (
                                <div class="overlay" style="width: 170px;">
                                    <Menu>
                                        <Menu.Item onClick={() => handleDeleteFile(file)}>
                                            <div class="flex items-center">
                                                <Trash2 class="mr-2" width="14px" height="14" />
                                                {i18next.t('home.main.table.deleteText')}
                                            </div>
                                        </Menu.Item>
                                    </Menu>
                                </div>
                            ),
                        }}
                    </Dropdown>
                </div>
            </div>
        ));
    }

    return () => (
      <div>
        <div class="docs-head flex items-center justify-between">
            <div class="flex items-center gap-4">
                <TextButton class={['docs-title', !onlyFavorites.value ? 'active' : '']} size="large" onClick={() => homeStore.setOnlyFavorites(false)}>{i18next.t('home.main.title')}</TextButton>
                <TextButton class={['docs-title', onlyFavorites.value ? 'active' : '']} size="large" onClick={() => homeStore.setOnlyFavorites(true)}>{i18next.t('home.favorite.title')}</TextButton>
            </div>
            <div style="height: 32px;">
                <Button class="createDocBtn createDocBtn-blank mr-2" type="primary" onClick={handleAddEmptyDoc}>
                    <div class="flex items-center">
                        <FilePlus2 class="mr-1" width="18" height="18" />
                        {i18next.t('home.main.createDocBtnText')}
                    </div>    
                </Button>

                <Button class="createDocBtn createDocBtn-template" type="primary" onClick={handleAddDocByTemplate}>
                    <div class="flex items-center">
                        <Blend class="mr-1" width="18" height="18" />
                        {i18next.t('home.main.createDocByTemplateBtnText')}
                    </div>
                </Button>
            </div>
        </div>
        <div class="list">
            <div class="list-head">
                <div>{i18next.t('home.main.table.title')}</div>
                <div>{i18next.t('home.main.table.owner')}</div>
                <div>{i18next.t('home.main.table.lastUpate')}</div>
                <div class="text-right">{i18next.t('home.main.table.action')}</div>
            </div>
            <div class="list-body">
                {renderDocs()}

                {showFooterText?.value ? (
                    <div class="docs-footer">
                        <span class="px-3.5">{i18next.t('home.main.table.reachBotton')}</span>
                    </div>
                ) : ''}
            </div>
        </div>

        <RouterView />
      </div>
    );
  }
});
</script>

<style scoped lang="less">

.list {
    padding: 0 24px 32px 12px;
}

.list-head, .list-row {
    position: relative;
    display: grid;
    grid-template-columns: 12fr 4fr 4fr 1fr;
    height: 60px;
    align-items: center;
    padding: 0 24px;
}

.list-head {
    color: var(--light-text-color);
    font-weight: 500;
}

.list-row {
    color: var(--text-color);
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;

    &:before {
        content: '';
        position: absolute;
        height: 1px;
        right: 4px;
        left: 14px;
        top: 0;
        background: var(--doclist-border-color);
    }

    &:hover {
        background: var(--fill-color);
    }

    &:hover:before {
        background: transparent;
    }

    &:hover .doc-favoriteBtn {
        opacity: 1;
    }
}

.doc-favoriteBtn {
    opacity: 0;
}

.list-row:hover + .list-row::before {
    background: var(--body-bg);
}

.docIcon {
    width: 22px;
    height: 22px;
    background: url('@/assets/doc-round.svg') no-repeat center;
    background-size: contain;
}

.docEmoji {
    font-size: 22px;
    width: 22px;
    display: flex;
    justify-content: center;
}

.docs-head {
    position: sticky;
    top: 0;
    background: var(--blur-bg);
    backdrop-filter: blur(4px);
    z-index: 1;

    padding: 18px 24px 18px 26px;
    font-size: 20px;
    font-weight: 500;
    border-bottom: 1px solid var(--default-border-color);
}

.docs-title {
    font-size: 20px!important;
    font-weight: 500!important;

    transition: color .3s ease;
}

.docs-title.active {
    color: var(--primary-text-color);
}

.docs-footer {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 0;
    text-align: center;
    color: #8f959e;
}

.docs-footer:before {
    display: inline-flex;
    content: "";
    height: 1px;
    width: 5%;
    background: linear-gradient(90deg, #8f959e00, #8f959e);
}

.docs-footer:after {
    display: inline-flex;
    content: "";
    height: 1px;
    width: 5%;
    background: linear-gradient(90deg, #8f959e, #8f959e00);
}

.docs-empty, .docs-loading {
    text-align: center;
    margin: 100px auto;
    width: 400px;
    left: 0;
    right: 0;
}

.docs-empty_illustration {
    display: flex;
    justify-content: center;
}

.docs-empty_text {
    color: #646a73;
}

.docTag {
    color: #646a73;
    font-size: 12px;
}

.createDocBtn {
    padding: 4px 10px 4px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: none;
    outline: none;
}

.createDocBtn-blank {
    color: var(--createBlankDocBtn-color);
    background: var(--createBlankDocBtn-bg);
}

.createDocBtn-blank:hover {
    color: rgb(46, 109, 233);
    background: rgba(2, 82, 243, 0.24);
}

.createDocBtn-template {
    color: var(--createTemplateDocBtn-color);
    background: var(--createTemplateDocBtn-bg);
}

.createDocBtn-template:hover {
    color: rgb(94, 2, 210);
    background: rgba(94, 2, 210, 0.12);
}
</style>