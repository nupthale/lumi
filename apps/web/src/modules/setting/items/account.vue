<script lang="tsx">
import { defineComponent, onMounted } from 'vue';
import { Button, Input } from 'ant-design-vue';
import { UserAvatar } from '@zsfe/zsui';
import { storeToRefs } from 'pinia';
import { debounce } from 'lodash-es';

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

    const saveAliasName = debounce(async (name)  => {
        try {
            if (window.clientAPI) {
                await window.clientAPI.saveSetting({
                    key: 'aliasName',
                    value: name,
                });
            }
        } catch(e) {
            console.error(e);
        }
    }, 300);

    const handleUpdateName = (name: string) => {
        user.value.name = name;

        saveAliasName(name);
    };

    return () => (
        <div class="settingItem">
            <div class="settingItem__left flex items-center">
                <UserAvatar class="mr-2" username={user.value?.name} size="large" showText={false} />
                <Input 
                    suffix={i18next.t('setting.aliasName')}
                    placeholder={i18next.t('setting.aliasNamePlaceholder')}
                    style="width: 240px; box-shadow: none; outline: none; " 
                    value={user.value?.name}
                    onChange={(e) => handleUpdateName(e.target.value || '')}
                />
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