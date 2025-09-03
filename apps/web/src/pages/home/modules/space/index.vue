<script lang="tsx">
import { defineComponent, watchEffect, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ChevronDown } from 'lucide-vue-next';
import { Dropdown, Menu, message, Tooltip, Modal } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import i18next from 'i18next';
import { Check, Plus, Trash, SquarePen } from 'lucide-vue-next';

import { useContextStore } from '@/store/ui-states/context'; 
import { useSpaces } from '@/store/queries/docs/useSpaces';

import EditModal from './EditModal.vue';

export default defineComponent({
  setup() {
    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);
    const { spaces } = useSpaces();

    const dropdownRef = ref();

    watchEffect(() => {
        if (!crtSpace?.value && spaces.value?.length) {
          contextStore.setCrtSpace(spaces.value[0]?._id);
        }
    });

    const crtSpaceRef = computed(() => {
        const space = spaces.value?.find((space: any) => space._id === crtSpace.value);
        return space;
    });

    const handleAddSpace = () => {
        if (spaces.value?.length >= 10) {
            message.error(i18next.t('home.space.spaceLimit'));
            return;
        }

        contextStore.setCrtEditSpace('');
        contextStore.setEditSpaceModalVisible(true);
    }

    const handleEditSpace = (space: any) => {
        contextStore.setCrtEditSpace(space._id);

        contextStore.setEditSpaceModalVisible(true);
    }

    const stopEvent = (e: any) => {
        e.stopPropagation();   
    }

    return () => (
        <div class="spaceWrap flex items-center justify-between">
            <Dropdown ref={dropdownRef} placement="bottomRight">
                {{
                    default: () => (
                        <TextButton class="flex items-center -ml-1">
                            <div class="truncate">
                                {!crtSpaceRef.value?.isSystem ? (crtSpaceRef.value?.name || '-') : i18next.t(crtSpaceRef.value?.name)}
                            </div>
                            <ChevronDown class="ml-2" width="14px" />
                        </TextButton>
                    ),
                    overlay: () => (
                        <div class="overlay" style="width: 220px;">
                            <Menu
                                selectedKeys={[]}
                            >
                                {
                                    spaces.value?.map((space: any) => (
                                        <Menu.Item key={space._id} onClick={() => contextStore.setCrtSpace(space._id)}>
                                            <div class="spaceItem flex items-center justify-between">
                                                <div>
                                                    <div class="truncate">{!space.isSystem ? (space.name || '-') : i18next.t(space.name)}</div>
                                                    {
                                                        space.description ? (
                                                            <div class="lightText text-xs truncate">
                                                                {!space.isSystem ? (space.description || '-') : i18next.t(space.description)}
                                                            </div>
                                                        ) : ''
                                                    }
                                                </div>

                                                <div class="rightSection flex items-center">
                                                    {
                                                        (!space.isSystem) && (
                                                            <div class="flex items-center actions" onClick={stopEvent}>
                                                                {/* <Tooltip title={i18next.t('common.delete')}>
                                                                    <TextButton size="small" style="height: 24px;" onClick={() => handleDelete(space)}>
                                                                        <Trash width="14px" />
                                                                    </TextButton>
                                                                </Tooltip> */}
                                                                <Tooltip title={i18next.t('common.edit')}>
                                                                    <TextButton size="small" style="height: 24px;" onClick={() => handleEditSpace(space)}>
                                                                        <SquarePen width="14px" />
                                                                    </TextButton>
                                                                </Tooltip>
                                                            </div>
                                                        )
                                                    }

                                                    {
                                                        space._id === crtSpace.value && (
                                                            <Check class="ml-1.5" width="16px" strokeWidth="3px" color="#4c88ff" />
                                                        )
                                                    }
                                                </div>
                                                
                                            </div>
                                        </Menu.Item>
                                    ))
                                }

                                <div class="divider"></div>
                                <div>
                                    <Menu.Item key="create" onClick={handleAddSpace}>
                                        <div class="flex items-center">
                                            <Plus width="14px" class="mr-1" />
                                            <span>{i18next.t('home.space.createSpace')}</span>
                                        </div>
                                    </Menu.Item>
                                </div>
                            </Menu>
                            
                        </div>
                    ),
                }}
            </Dropdown>
            
            <div class="freeTag">
                {i18next.t('home.sider.freeTag')}
            </div>

            <EditModal />
        </div>
    );
  },
})
</script>

<style scoped>
.spaceWrap {
    font-size: 12px;
    font-weight: 500;
    color: var(--light-text-color);
    padding-left: 26px;
    padding-right: 22px;
    margin-bottom: 12px;
}

.freeTag {
    padding: 0 4px;
    background: var(--free-tag-color);
    border-radius: 4px;
    font-size: 12px;
}

.divider {
    margin: 4px 12px;
    height: 1px;
    background: var(--float-border-color);
}

.spaceItem {
    overflow: hidden;
    user-select: none;
}

.actions {
    opacity: 0;
    transform: translateX(-10px);
    transition: all .1s ease;
}

.spaceItem:hover .actions {
    opacity: 1;
    transform: translateX(0);
}
</style>