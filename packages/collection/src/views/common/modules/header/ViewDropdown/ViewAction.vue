<script lang="tsx">
import { defineComponent, PropType, ref, inject } from 'vue';
import { TextButton } from '@zsfe/zsui';
import { Dropdown, Menu } from 'ant-design-vue';
import { SquarePen, Ellipsis, Trash2 } from 'lucide-vue-next';

import { i18next } from '@collection/i18next';
import { CollectionSchemaType, ViewEnum, ViewType } from '@collection/interface';
import { themeTokens } from '@collection/shared/theme';
import { deleteView$ } from '@collection/events';

const MenuItem = Menu.Item;

export default defineComponent({
  props: {
    view: Object as PropType<ViewType>,
    schema: Object as PropType<CollectionSchemaType>,
  },
  emits: ['rename'],
  setup(props, { emit }) {
    const id = inject<string>('id')!;

    const popupContainer = ref();

    const handleDeleteView = () => {
        deleteView$.next({
            id,
            view: props.view!,
        });
    }

    const handleRename = () => {
        emit('rename');
    }

    return () => (
        <Dropdown getPopupContainer={(node) => popupContainer.value || document.body}>
            {{
                default: () => (
                    <div ref={popupContainer}>
                        <TextButton class="-mr-2 lightText" onClick={e => e.stopPropagation()}>
                            <Ellipsis width={16} height={16} />
                        </TextButton>
                    </div>
                ),
                overlay: () => (
                    <div class="dropdownContainer w-[160px]" onClick={e => e.stopPropagation()}>
                        <Menu>
                            <MenuItem key={1} onClick={handleRename}>
                                <div class="flex items-center gap-2">
                                    <SquarePen width={16} height={16} color={themeTokens.lightTextColor()} />
                                    {i18next.t('collection.viewAction.rename')}
                                </div>
                            </MenuItem>
                            <MenuItem key={2} disabled={(props.schema?.views?.length || 0) <= 1} onClick={handleDeleteView}>
                                <div class="flex items-center gap-2">
                                    <Trash2 width={16} height={16}  />
                                    {i18next.t('collection.viewAction.delete')}
                                </div>
                            </MenuItem>
                        </Menu>
                    </div>
                )
            }}
        </Dropdown>
    );
  }
});
</script>

<style scoped>
</style>