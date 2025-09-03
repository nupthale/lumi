<script lang="tsx">
import { defineComponent, ref, onMounted } from 'vue';
import { Menu, Input } from 'ant-design-vue';
import i18next from 'i18next';

import LucideIcon from '@/components/LucideIcon/index.vue';
import Modal from '@/components/Modal/index.vue';

import { themeTokens } from '@/shared/theme';

import { useContextStore } from '@/store/ui-states/context';

import Account from './items/account.vue';
import Appearance from './items/appearance.vue';
import Language from './items/language.vue';
import Location from './items/location.vue';
import { storeToRefs } from 'pinia';

const MenuItem = Menu.Item;

export default defineComponent({
  setup() {
    const selectedKeys = ref(['1']);

    const contextStore = useContextStore();
    const { settingModalVisible } = storeToRefs(contextStore);

    onMounted(() => {
      if (isElectron && window.clientAPI) {
        window.clientAPI.on('open-setting', () => {
          contextStore.setSettingModalVisible(true);
        });
      }
    });

    const stopEvt = (e) => e.stopPropagation(); 

    return () => (
      <Modal visible={settingModalVisible.value} maskClosable onClose={() => contextStore.setSettingModalVisible(false)}>
        <div class="setting" onClick={stopEvt}>
            <div class="sider">
              <div class={['menus', 'flex-1']} >
                <div class="menuTitle">{i18next.t('setting.title') }</div>
                <Menu
                  class={['customSettingMenu']}
                  mode="inline"
                  selectedKeys={selectedKeys.value}
                  onSelect={(params) => selectedKeys.value = params.selectedKeys}
                >
                  <MenuItem key="1" icon={<LucideIcon icon="FileText" width={18} color={themeTokens.lightTextColor()} />} class="flex items-center">
                    <div>
                      {i18next.t('setting.preference')}
                    </div>
                  </MenuItem>
                </Menu>
              </div>
              </div>
            

            {
              globalThis.isElectron ? (
                <div class="main-titleBar"></div>
              ) : ''
            }

            <div class={['main']}>
              <div class="settingTitle">
                账号
              </div>
              <div>
                <Account />
              </div>

              <div class="settingTitle !mt-12">
                {i18next.t('setting.preference')}
              </div>
              <div>
                <Appearance />
                <Language />
                <Location />
              </div>
            </div>
        </div>
      </Modal>
        
    );
  }
});
</script>

<style src="./index.css"></style>

<style scoped lang="less">
.setting {
  display: flex;
  width: 1000px;
  max-width: calc(-100px + 100vw);
  height: calc(-100px + 100vh);
}

.sider {
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  padding-top: var(--appBar-padding-top, 0);
  background: var(--home-sider-bg);
  border-right: 1px solid var(--home-sider-borderRight);
}

.menuTitle {
  font-size: 12px;
  font-weight: 500;
  color: var(--light-text-color);
  padding-left: 26px;
  margin-bottom: 12px;
}

.main {
  flex: 1;
  padding: 36px 60px;
}

.menus {
  flex: 1;
  margin-top: 40px;
  font-size: 14px;
  font-weight: 500;
  padding-bottom: 48px;
  overflow-y: auto;
  user-select: none;
}

.customSettingMenu {
  width: 240px!important;
  transition: all .3s ease;
  border-inline-end: none!important;
  background: none!important;
}

.customSettingMenu :deep(.ant-menu-item) {
  height: 30px!important;
  border-radius: 4px!important;
}

.customSettingMenu :deep(.ant-menu-sub.ant-menu-inline) {
  background: none!important;
}

.customSettingMenu :deep(.ant-menu-item-selected svg) {
  color: #1456f0;
}
</style>