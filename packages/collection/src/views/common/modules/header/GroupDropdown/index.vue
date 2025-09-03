<script lang="tsx">
import { defineComponent, PropType, inject, ref } from 'vue';
import { Dropdown, Tooltip, Menu } from 'ant-design-vue';
import { CircleSlash } from 'lucide-vue-next';

import { i18next } from '@collection/i18next';

import ColumnIcon from '@collection/components/ColumnIcon.vue';
import { CollectionSchemaType, ColumnType } from '@collection/interface';
import { group$ } from '@collection/events';

const MenuItem = Menu.Item;

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
    },
    setup(props, { slots }) {
        const id = inject<string>('id')!;

        const handleSelect = (column: ColumnType | null) => {
            if (!props.schema) return;

            const view = props.schema.views.find(view => view.id === props.schema?.viewId);
            group$.next({
                id,
                viewId: view?.id!,
                groupBy: column ? {
                    columnId: column.id,
                } : undefined,
            })
        }

        return () => {
            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

            return (
                <Dropdown trigger="click">
                    {{
                        default: slots.default,
                        overlay: () => {
                            return (
                                <div class="dropdownContainer w-[220px]">
                                    <Menu class="p-1" selectedKeys={[]}>
                                        <MenuItem 
                                            key='none' 
                                            class="flex items-center justify-between"
                                            onClick={() => handleSelect(null)}
                                        >
                                            <div class="flex items-center flex-1">
                                                <CircleSlash width={14} height={14} color="#5E656D" />
                                                <div class="ml-2 truncate">{i18next.t('collection.group.ungroup')}</div>
                                            </div>
                                        </MenuItem>
                                        {
                                            view?.columnsConfig?.map((config) => {
                                                const column = props.schema?.columns?.find(item => item.id === config.id)!;
                                                return (
                                                    <MenuItem 
                                                        key={column.id} 
                                                        class="flex items-center justify-between"
                                                        onClick={() => handleSelect(column)}
                                                    >
                                                        <div class="flex items-center flex-1">
                                                            <ColumnIcon type={column.type} />
                                                            <div class="ml-2 truncate">{column.title}</div>
                                                        </div>
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Menu>
                                </div>
                            )
                        }
                    }}
                </Dropdown>
            )
        }
    }
})
</script>

<style scoped>
</style>