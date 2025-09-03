<script lang="tsx">
import { defineComponent, computed, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { TextButton, Tag } from '@zsfe/zsui';
import { ChevronDown, Plus, Hash, Check } from 'lucide-vue-next';
import { Popover as AntdPopover, Input, Tooltip, message } from 'ant-design-vue';
import i18next from 'i18next';

import { events } from '@/database/index';

export default defineComponent({
    props: {
        doc: Object,
        initialTags: Array as PropType<string[]>,
        user: Object,
        store: Object,
        allTags: Array as PropType<string[]>,
    },
    setup(props) {
        const inputRef = ref();

        const selectedTags = ref<string[]>([...props.initialTags || []]);

        // 当 props.initialTags 变化时更新本地状态
        watch(() => props.initialTags, (newTags) => {
            selectedTags.value = [...newTags || []];
        }, { immediate: true });

        const searchText = ref('');

        const selectedIds = computed(() => {
            return selectedTags.value?.map(tag => tag);
        });

        const handleSearch = (e) => {
            searchText.value = e.target.value;
        }

        const handleSelect = async (name: string) => {
            // 有的话就反选
            if (selectedIds.value?.includes(name)) {
                selectedTags.value = selectedTags.value?.filter(tag => tag !== name);
            } else {
                selectedTags.value.push(name);
            }

            events.fileUpdated({
                id: props.doc?.fileId,
                tags: selectedTags.value?.map(tag => tag)
            });

            searchText.value = '';
        }

        const filteredTags = computed(() => {
            if (!searchText.value?.trim()) {
                return props.allTags;
            }

            return props.allTags?.filter(tag => tag.includes(searchText.value));
        });

        const handleOpenChange = () => {
            setTimeout(() => {
                inputRef.value?.focus();
            }, 10)
        }

        const isTextExist = (text: string) => {
            if (props.allTags?.some(tag => tag === text)) {
                return true;
            }
            return false;
        }

        const handleAddTag = async () => {
            const text = searchText.value?.trim();

            if (!text) {
                message.error(i18next.t('doc.tag.placeholder'));
                return;
            }

            if (isTextExist(searchText.value)) {
                message.error(i18next.t('doc.tag.tagExist'));
                return;
            }

            try {
                handleSelect(searchText.value);

                searchText.value = '';
            } catch(e) {
                console.log(e);
            }
        }

        const handleKeydown = (e) => {
            e.stopPropagation();
        }

        return () => (
            <div class="flex items-center">
                <div class="flex items-center">
                    {
                        selectedTags.value?.map(tag => (
                            <Tag key={tag} size="small" color="blue" class="mr-1"><Hash width="12px" class="mr-1" /> {tag}</Tag>
                        ))
                    }
                </div>
                <AntdPopover trigger="click" placement="bottom" onOpenChange={handleOpenChange} getPopupContainer={(node) => node.parentElement || document.body}>
                   {{
                    default: () => (
                        <TextButton class={['addBtn', selectedTags.value?.length ? '' : '-ml-[5px]']} size="small">
                            {
                                selectedTags.value?.length ? (
                                    <ChevronDown size={18} color="#646a73" />
                                ) : (
                                    <div class="flex items-center">
                                        <span class="mr-1 lightText text-base">{i18next.t('doc.tag.addTag')}</span>
                                        <Tooltip title={i18next.t('doc.tag.addTag')}>
                                            <Plus size={18} color="#646a73" />
                                        </Tooltip>
                                    </div>
                                ) 
                            }
                        </TextButton>
                    ),
                    content: () => (
                        <div class="container">
                            <div class="" >
                                <Input
                                    size="large"
                                    placeholder={filteredTags.value?.length ? i18next.t('doc.tag.searchPlaceholder') : i18next.t('doc.tag.addPlaceholder') } 
                                    autofocus
                                    ref={inputRef}
                                    value={searchText.value}
                                    onPressEnter={handleAddTag}
                                    onChange={handleSearch}
                                    onKeydown={handleKeydown}
                                >
                                    {{
                                        suffix: () => (
                                            <Tooltip title={i18next.t('doc.tag.addTag')}>
                                                <TextButton onClick={handleAddTag}>
                                                    <Plus width="18px" color="#646a73" />
                                                </TextButton>
                                            </Tooltip>
                                        )
                                    }}
                                </Input>
                            </div>

                            {
                                filteredTags.value?.length ? (
                                    <div class="p-2">
                                        {
                                            filteredTags.value?.map(tag => (
                                                <div key={tag} class={['item', selectedIds.value?.includes(tag) ? 'selected' : '']} onClick={() => handleSelect(tag)}>
                                                    <div class="flex items-center">
                                                        <Hash width="14px" class="mr-1" /> 
                                                        {tag}
                                                    </div>

                                                    {
                                                        selectedIds.value?.includes(tag)? (
                                                            <Check size={16} color="#3370ff" />
                                                        ) : ''
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : ''
                            }
                        </div>
                    ),
                   }}
                </AntdPopover>
            </div>
        );
    }
})
</script>

<style scoped>
.container {
    width: 320px;
    border: 1px solid var(--float-border-color);
    border-radius: 6px;
    overflow: hidden;
}

.addBtn :deep(svg) {
    outline: none;
}

.container :deep(.ant-input-affix-wrapper) {
    border-radius: 0;
    border-width: 0;
    box-shadow: none!important;
    border-color: #d9d9d9!important;
    font-size: 14px!important;
}

.item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 8px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        background: var(--fill-color);
    }

    &.selected {
        color: #3370ff;
    }
}
</style>