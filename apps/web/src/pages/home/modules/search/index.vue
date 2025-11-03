<script lang="tsx">
import { defineComponent, Teleport, ref, watch, watchEffect, computed } from 'vue';
import { Input } from 'ant-design-vue';
import { ArrowDownUp, CornerDownLeft } from 'lucide-vue-next';
import i18next from 'i18next';
import { Tag } from '@zsfe/zsui';
import { useDebounceFn, useEventListener } from '@vueuse/core';
import { storeToRefs } from 'pinia';

import LucideIcon from '@/components/LucideIcon/index.vue';
import { searchIndex } from '@/shared/search/main';

import { useContextStore } from '@/store/ui-states/context';

import { useAllFiles } from '@/store/queries/docs/useAllFiles';

import { FileSchema } from '@/database/schema/file';

import { useEvent } from './useEvent';

type SearchResultType = FileSchema & {
    matchedText?: string;
};

export default defineComponent({
    setup() {
        const inputRef = ref();

        const contextStore = useContextStore();
        const { searchModalVisible } = storeToRefs(contextStore);

        const { files } = useAllFiles();

        const searchText = ref('');

        const matchedFiles = ref<SearchResultType[]>(files.value || []);

        const { handleClickItem, handleClose, handleHoverItem, crtItemIndex, scrollContainer } = useEvent(matchedFiles);

        const search = useDebounceFn(async () => {
            const val = searchText.value;

            if (!val?.length) {
                matchedFiles.value = files.value || [];
                return;
            }

            try {
                const result = await searchIndex.search({
                    query: val,
                    // Enable context extraction and highlighting
                    enrich: true,  // Return stored document data
                    suggest: true, // Enable suggestion/autocomplete
                    limit: 100,    // Limit number of results
                    // Extract context around matches
                    context: {
                        depth: 3,     // Number of words before and after match
                        bidirectional: true
                    },
                    merge: true,
                });
                
                const matched = result.map(item => {
                    const fileId = item.id;
                    const matchedText = item.doc?.content || '';

                    const file = files.value.find(fItem => fItem._id === fileId);
                    
                    return {
                        ...file,
                        matchedText,
                    }
                });

                const wikis = files.value?.filter(file => !!file.wiki);
                wikis.forEach(wiki => {
                     if (wiki.title.includes(searchText.value)) {
                        matched.push({
                            ...wiki,
                        })
                     }
                });

                matchedFiles.value = matched || [];
            } catch(e) {
                console.error(e);
            }
        }, 300);

        const handleSearch = (val: string) => {
            searchText.value = val || '';

            search();
        }

        watch(files, () => {
            search();
        });

        watchEffect(() => {
            if (searchModalVisible.value) {
                setTimeout(() => {
                    inputRef.value?.focus();
                }, 0);
            }
        });

        const highlight = (matchedText: string) => {
            if (!searchText.value?.length) return matchedText;

            return matchedText?.replace(new RegExp(`${searchText.value}`, 'gim'), `<span class="mark">${searchText.value}</span>`)
        }

        return () => searchModalVisible.value ? (
            <Teleport to={document.body}>
                <div class="wrapper" onClick={handleClose}>
                    <div class="main px-1" onClick={e => e.stopPropagation()}>
                        <Input ref={inputRef} class="searchInput" placeholder={i18next.t('home.favorite.searchPlaceholder')} style="width: 100%" onChange={(e) => handleSearch(e.target.value || '')}>
                            {{
                            addonBefore: () => (
                                <LucideIcon icon="Search" width={20} color="#646a73" />
                            )
                            }}
                        </Input>

                        <div class="mt-1 flex-1 overflow-y-auto" ref={scrollContainer}>
                            <div class="relative">
                                {
                                    matchedFiles.value?.length ? matchedFiles.value?.map((file, index) => (
                                        <div class={['searchItem', 'py-2', 'px-3', 'flex', 'items-start', index === crtItemIndex.value ? 'active' : '']} data-id={file._id} key={file._id} onClick={() => handleClickItem(file)} onMouseenter={() => handleHoverItem(index)}>
                                            <div class="searchItem__icon mr-3 flex-shrink-0">
                                                {
                                                    file.emoji ? (
                                                        <div class="docEmoji">{file.emoji}</div>
                                                    ) : (
                                                        <div class={file.assetType === 'journal' ? 'journalIcon' : file.wiki ? 'wikiIcon' : 'docIcon'}></div>
                                                    )
                                                }
                                            </div>
                                            <div class="flex-1 overflow-hidden">
                                                <div class="searchItem__title mb-1">
                                                    {file.wiki ? <span>{file.fileTitle} - </span> : ''}
                                                    {file.title ? <span innerHTML={highlight(file.title)}></span> : i18next.t('home.main.table.titlePlaceholder')}
                                                </div>
                                                {file.matchedText && (
                                                    <div class="searchItem__context text-sm lightText" innerHTML={highlight(file.matchedText)}></div>
                                                )}
                                                <div class="searchItem__foot mt-1">
                                                    {i18next.t('home.space.space')}: {file.space?.isSystem ? i18next.t(file.space?.name) : file.space?.name}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div class="lightText ml-3">
                                            {i18next.t('home.main.searchNoResult')}
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div class="footer flex items-center gap-5 px-4">
                            <div class="flex items-center gap-1.5">
                                <ArrowDownUp size={12} />
                                {i18next.t('common.select')}
                            </div>

                            <div class="flex items-center gap-1.5">
                                <CornerDownLeft size={12} />
                                {i18next.t('common.open')}
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>
            
        ) : '';
    }
})
</script>

<style scoped>
.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--modal-mask);
}

.main {
    display: flex;
    flex-direction: column;
    padding-top: 8px;
    font-size: 14px;

    box-shadow: var(--search-float-shadow);
    border-radius: 12px;
    min-height: max(80vh, 0px);
    max-height: max(80vh, 0px);
    width: 755px;
    top: 88px;
    overflow: hidden;

    background: var(--bg-float);
    backdrop-filter: var(--drawer-filter);
}

.searchInput {
    height: 48px;
    flex-shrink: 0;
}

.searchInput :deep(.ant-input) {
    height: 48px;
    background: none;
    border: none;
    font-size: 18px;
    font-weight: 500;
    outline: none;
    box-shadow: none;
}

.searchInput :deep(.ant-input-group-addon) {
    background: transparent;
    border: none;
    padding-right: 0;
}

.footer {
    font-size: 12px;
    height: 40px;
    flex-shrink: 0;
    color: var(--text-caption);
}

.docIcon {
    width: 22px;
    height: 22px;
    background: url('@/assets/doc-round.svg') no-repeat center;
    background-size: contain;
}

.wikiIcon {
    width: 22px;
    height: 22px;
    background: url('@/assets/wiki-round.svg') no-repeat center;
    background-size: contain;
}

.journalIcon {
    width: 22px;
    height: 22px;
    background: url('@/assets/journal-round.svg') no-repeat center;
    background-size: contain;
}

.searchItem {
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
}

.searchItem__title {
    font-weight: 600;
}

.searchItem.active {
    background:  var(--fill-color);
}

.searchItem__foot {
    color: var(--text-caption);
}

.searchItem__context {
    line-height: 1.5;
}

.searchItem__title :deep(.mark), .searchItem__context :deep(.mark) {
    color: var(--B500);
    padding: 1px 2px;
    font-weight: 500;
}

.docEmoji {
    font-size: 22px;
    width: 22px;
    display: flex;
    justify-content: center;
}
</style>