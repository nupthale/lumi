<script lang="tsx">
import { defineComponent, PropType, inject } from 'vue';
import { TextButton } from '@zsfe/zsui';
import { Dropdown, Menu } from 'ant-design-vue';
import { ChevronDown, Ellipsis } from 'lucide-vue-next';
import { nanoid } from 'nanoid';

import { i18next } from '@collection/i18next';

import ViewIcon from '@collection/components/ViewIcon.vue';
import { CollectionSchemaType, ViewEnum, ViewType } from '@collection/interface';
import { addView$, switchView$, hideDropdown$ } from '@collection/events';
import { getViewTypeText } from '@collection/shared/view';

import ViewItem from './ViewItem.vue';

const MenuItem = Menu.Item;

export default defineComponent({
  props: {
    schema: Object as PropType<CollectionSchemaType>,
  },
  setup(props) {
    const id = inject<string>('id')!;

    const handleAddView = (type: ViewEnum) => {
        addView$.next({
            id,
            view: {
                id: nanoid(8),
                type,
                name: getViewTypeText(type),
                columnsConfig: props.schema?.columns?.map(column => ({
                    id: column.id,
                    hidden: false,
                })) || [],
                cardConfig: {},
            }
        })
    }

    const handleSwitchView = (view: ViewType) => {
        switchView$.next({
            id,
            view,
        })
    }

    const handleOpenChange = (visible: boolean) => {
        if (visible) {
            hideDropdown$.next();
        }
    }

    return () => {
        const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

        return (
            <Dropdown onOpenChange={handleOpenChange} destroyPopupOnHide>
                {{
                    default: () => (
                        <TextButton>
                            <div class="flex items-center gap-2">
                                <ViewIcon type={view?.type} size={16} />
                                {view?.name || '-'}
                                <ChevronDown size={14} />
                            </div>
                        </TextButton>
                    ),
                    overlay: () => (
                        <div class="dropdownContainer !p-0 w-[220px]">
                            <Menu selectedKeys={[]}>
                                {
                                    props.schema?.views?.map(view => (
                                        <MenuItem key={view.id} onClick={() => handleSwitchView(view)}>
                                            <ViewItem
                                                schema={props.schema}
                                                view={view}
                                            />
                                        </MenuItem>
                                    ))
                                }
                                <div class="divider mb-3 mt-1"></div>
                                <div class="text-xs lightText pl-3 my-2">{i18next.t('collection.newView')}</div>
                                <MenuItem key={ViewEnum.GRID} onClick={() => handleAddView(ViewEnum.GRID)}>
                                    <div class="flex items-center gap-2">
                                        <ViewIcon type={ViewEnum.GRID} size={16} />
                                        {getViewTypeText(ViewEnum.GRID)}
                                    </div>
                                </MenuItem>
                                {/* <MenuItem class="!py-0" key={ViewEnum.BOARD} onClick={() => handleAddView(ViewEnum.BOARD)}>
                                    <div class="flex items-center gap-2">
                                        <ViewIcon type={ViewEnum.BOARD} size={16} />
                                        {getViewTypeText(ViewEnum.BOARD)}
                                    </div>
                                </MenuItem> */}
                                <MenuItem key={ViewEnum.GALLERY} onClick={() => handleAddView(ViewEnum.GALLERY)}>
                                    <div class="flex items-center gap-2">
                                        <ViewIcon type={ViewEnum.GALLERY} size={16} />
                                        {getViewTypeText(ViewEnum.GALLERY)}
                                    </div>
                                </MenuItem>
                            </Menu>
                        </div>
                    )
                }}
            </Dropdown>
        );
    };
  }
});
</script>

<style scoped>
.container {

}
</style>