<script lang="tsx">
import { defineComponent } from 'vue';
import { UserAvatar } from '@zsfe/zsui';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store/user';

import { useOnlineUsers } from '../../hooks/useOnlineUsers';
import UserGroup from '../UserGroup.vue';

import ExportFile from './ExportFile.vue';

export default defineComponent({
    props: {
        fileId: String,
    },
    setup(props) {
        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);

        const { onlineUsers } = useOnlineUsers();

        return () => (
            <div class="h-[28px] flex items-center">
                  {
                    onlineUsers.value?.length > 1 ? (
                      <UserGroup users={onlineUsers.value} maxCount={10} />
                    ) : ''
                  }
                  <div>
                    <ExportFile fileId={props.fileId} />
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