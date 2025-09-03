<script lang="tsx">
import { defineComponent, PropType, inject, ref } from 'vue';
import { Dropdown, Tooltip } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { GripVertical, Eye, EyeClosed } from 'lucide-vue-next';
import Sortable from 'sortablejs';

import { i18next } from '@collection/i18next';
import ColumnIcon from '@collection/components/ColumnIcon.vue';
import { CollectionSchemaType, ViewEnum, ColumnConfigType } from '@collection/interface';
import { updateColumnOrder$, updateColumnConfig$ } from '@collection/events';
import { themeTokens } from '@collection/shared/theme';

import GallerySetting from './settings/gallery.vue';

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
    },
    setup(props, { slots }) {
        const id = inject<string>('id')!;

        const sortContainer = ref();
        const sortRef = ref<Sortable>();

        const handleVisibleChange = (visible: boolean) => {
            setTimeout(() => {
                if (visible) {
                    sortRef.value = Sortable.create(sortContainer.value, {
                        handle: '.sortHandle',
                        direction: 'vertical',
                        animation: 150,
                        chosenClass: 'selected',
                        ghostClass: 'ghostClass',
                        easing: "cubic-bezier(1, 0, 0, 1)",
                        draggable: ".columnItem",
                        onEnd: (e) => {
                            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

                            updateColumnOrder$.next({
                                id,
                                viewId: view?.id || '',
                                oldIndex: e.oldIndex,
                                newIndex: e.newIndex,
                            })
                        }
                    });
                } else {
                    sortRef.value?.destroy();
                }
            }, 0)
        }

        const handleToggleHidden = (config: ColumnConfigType) => {
            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

            updateColumnConfig$.next({
                id,
                viewId: view?.id || '',
                columnId: config.id,
                config: {
                    hidden: !config.hidden,
                }
            })
        }

        const renderExtraSetting = () => {
            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

            if (view?.type === ViewEnum.GALLERY) {
                return (<GallerySetting id={id} schema={props.schema} />);
            }
        }

        return () => {
            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

            return (
                <Dropdown trigger="click" onOpenChange={handleVisibleChange}>
                    {{
                        default: slots.default,
                        overlay: () => {
                            return (
                                <div class="dropdownContainer w-[220px]">
                                    {renderExtraSetting()}

                                    <ul ref={sortContainer} class="p-1" onClick={e => e.stopPropagation()}>                                    
                                        {
                                            view?.columnsConfig?.map((config) => {
                                                const column = props.schema?.columns?.find(item => item.id === config.id)!;
                                                return (
                                                    <li key={column.id} class="columnItem column flex items-center justify-between">
                                                        <div class="flex items-center flex-1">
                                                            <div class="handle mr-2 sortHandle cursor-grabbing ">
                                                                <GripVertical width={16} height={16 } />
                                                            </div>

                                                            <ColumnIcon type={column.type} />
                                                            <div class="ml-2 truncate">{column.title}</div>
                                                        </div>
                                                        <div>
                                                            <Tooltip title={config.hidden ? i18next.t('common.show') : i18next.t('common.hide')}>
                                                                <TextButton onClick={handleToggleHidden}>
                                                                    {
                                                                        config.hidden ? (
                                                                            <EyeClosed width={14} height={14} color={themeTokens.lightTextColor()} />
                                                                        ) : (
                                                                            <Eye width={14} height={14} color={themeTokens.lightTextColor()} />
                                                                        )
                                                                    }
                                                                </TextButton>
                                                            </Tooltip>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        }
                    }}
                </Dropdown>
            );
        }
    }
})
</script>

<style scoped>
.column {
    padding: 0 12px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
}

.columnItem {
    color: var(--text-color);
}

.columnItem.selected {
    background: var(--menu-item-hover);
}

.ghostClass {
    opacity: 0;
}
</style>