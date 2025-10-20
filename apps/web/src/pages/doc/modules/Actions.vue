<script lang="tsx">
import { defineComponent } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import { TextButton, UserAvatar } from '@zsfe/zsui';
import { Download, FileCode2, FileJson2 } from 'lucide-vue-next';
import i18next from 'i18next';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store/user';
import { exportToJSON$, exportToMarkdown$ } from '@editor/Editor/event';

import { useOnlineUsers } from '../hooks/useOnlineUsers';
import UserGroup from './UserGroup.vue';

const MenuItem = Menu.Item;

export default defineComponent({
    props: {
        fileId: String,
    },
    setup(props) {
        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);

        const { onlineUsers } = useOnlineUsers();

        const renderActionOverlay = () => {
            return (
                <div class="dropdownContainer w-[180px]">
                <Menu activeKey='-1'>
                    <MenuItem key="1" onClick={() => exportToMarkdown$.next({ fileId: props.fileId })}>
                        <div class="flex items-center gap-2">
                            <FileCode2 size={16}  strokeWidth={1.8} />{i18next.t('export.markdown')}
                        </div>
                    </MenuItem>
                    <MenuItem key="2" onClick={() => exportToJSON$.next({ fileId: props.fileId })}>
                        <div class="flex items-center gap-2">
                            <FileJson2 size={16} strokeWidth={1.8} />{i18next.t('export.json')}
                        </div>
                    </MenuItem>
                    </Menu>
                </div>
            );
            }

        return () => (
            <div class="h-[28px] flex items-center">
                  {
                    onlineUsers.value?.length > 1 ? (
                      <UserGroup users={onlineUsers.value} maxCount={10} />
                    ) : ''
                  }
                  <div>
                    <Dropdown placement='bottomRight' trigger="hover">
                      {{
                        default: () => (
                          <TextButton>
                            <Download size={18} />
                          </TextButton>
                        ),
                        overlay: () => (
                          <div>
                            {renderActionOverlay()}
                          </div>
                        ),
                      }}
                    </Dropdown>
                  </div>

                  <div class="divider"></div>

                  <UserAvatar class="user" username={user.value?.name} showText={false} />
            </div>
        );
    }
});
</script>

<style scoped>
.user :deep(.zsui-user__avatar) {
  width: 32px!important;
  height: 32px!important;
  line-height: 32px!important;
}

.divider {
  width: 1px;
  height: 18px;
  background: var(--N400);
  margin: 0 16px;
}
</style>