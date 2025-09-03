<script lang="tsx">
import { defineComponent } from 'vue';
import { Button } from 'ant-design-vue';
import { UserAvatar } from '@zsfe/zsui';
import { storeToRefs } from 'pinia';

import i18next from 'i18next';
import { useUserStore } from '@/store/user';

import { getLogout } from '#/auth';

import { AppModeEnum } from '@/types/setting';

const isLocalMode = window.__appMode__ === AppModeEnum.LOCAL;

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const handleLogout = async () => {
        try {
            await getLogout();

            location.hash = '#/login';
            location.reload();
        } catch(e) {
            console.error(e);
        }
    }

    return () => (
        <div class="settingItem">
            <div class="settingItem__left">
                <UserAvatar username={user.value?.name} size="large" showText={false} />
                <span class="ml-2">{user.value?.name}</span>
            </div>
            {
                !isLocalMode ? (
                     <div class="settingItem__right">
                        <Button onClick={handleLogout}>{i18next.t('common.logout')}</Button>
                    </div>
                ) : ''
            }
        </div>
    );
  }
});
</script>

<style src="../index.css"></style>

<style scoped>
.optionItem {
    width: 180px;
}
</style>