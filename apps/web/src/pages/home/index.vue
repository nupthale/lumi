<script lang="tsx">
import { defineComponent, ref, provide, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { Menu, Input, Tooltip } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { storeToRefs } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { FileText, Star, Menu as MenuIcon, Settings, HardDrive, BookOpenText } from 'lucide-vue-next';
import i18next from 'i18next';

import LucideIcon from '@/components/LucideIcon/index.vue';

import { useMainScrollable } from './hooks/useMainScrollable';
import { useContextStore } from '@/store/ui-states/context';
import { useHomeStore } from '@/store/ui-states/home/index';
import { themeTokens } from '@/shared/theme';

import { useStorage } from '@/store/queries/docs/useStorage';

import Space from './modules/space/index.vue';
import Docs from './modules/docs/index.vue';
import Tags from './modules/tags/index.vue';
import Templates from './modules/templates/index.vue';
import Search from './modules/search/index.vue';

import Wikis from './modules/wikis/index.vue';

const MenuItem = Menu.Item;

export default defineComponent({
  setup() {
    const route = useRoute();
    const { isScrollable, scrollEl, scrollContentEl } = useMainScrollable();

    const siderCollapsed = useLocalStorage('siderCollapsed', false);

    const { usedSize } = useStorage();

    const contextStore = useContextStore();

    const homeStore = useHomeStore();

    const selectedKeys = ref<any[]>([route.path.includes('files') ? '1' : '2']);

    const handleMenuClick = () => {
      homeStore.setSelectedTag(null);
    }

    const handleSettingClick = () => {
      contextStore.setSettingModalVisible(true);
    }

    const handleSearchClick = () => {
      contextStore.setSearchModalVisible(true);
    }

    provide('showFooterText', isScrollable)

    return () => (
        <div class={['home', siderCollapsed.value ? 'siderCollapse' : '']}>
            <div class={['sider', siderCollapsed.value ? 'collapse' : '']}>
              <div class="sider-head flex items-center">
                <div class="logo"></div>
              </div>
 
              <div class={['menus', 'flex-1']} >
                <div class="searchWrap" onClick={handleSearchClick}>
                  <div class="searchInputBox">
                    <LucideIcon icon="Search" width={20} color="#646a73" />
                    <span class="ml-3">{selectedKeys.value?.includes('2') ? i18next.t('home.favorite.searchPlaceholder') : i18next.t('home.main.searchPlaceholder')}</span>
                  </div>
                </div>

                <Space />

                <Menu
                  class={['customMenu']}
                  mode="inline"
                  selectedKeys={selectedKeys.value}
                  onSelect={(params) => selectedKeys.value = params.selectedKeys}
                >
                  <MenuItem key="1" icon={<LucideIcon icon="FileText" width={18} color={themeTokens.lightTextColor()} />} class="flex items-center" onClick={handleMenuClick}>
                    <RouterLink to="/files">
                      {i18next.t('home.sider.doc')}
                    </RouterLink>
                  </MenuItem>
                  <MenuItem key="2" icon={<LucideIcon icon="BookOpenText" width={18} color={themeTokens.lightTextColor()} />} class="flex items-center" onClick={handleMenuClick}>
                    <RouterLink to="/wikis">
                      {i18next.t('home.sider.wiki')}
                    </RouterLink>
                  </MenuItem>
                </Menu>

                
                <Tags />
              </div>
                <div class={['config']}>
                  <div class="flex items-center">
                    <HardDrive width={18} height={18} color="#a6a6a6" />
                    {
                      usedSize.value ? (
                        <span class="ml-2">{usedSize.value[0]} <span class="lightText text-xs">{usedSize.value[1]}</span></span>
                      ) : (<span class="ml-2">-</span>)
                    }
                    
                  </div>
                  <div>
                    <Tooltip title={i18next.t('setting.title')}>
                      <TextButton onClick={handleSettingClick}>
                        <Settings width={20} height={20} color="#a6a6a6" />
                      </TextButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            
            <Tooltip placement='right' title={siderCollapsed.value ? i18next.t('home.sider.expand') : i18next.t('home.sider.collapse')}>
                <TextButton size="small" class={['foldButton', globalThis.isElectron ? 'electron' : '']} onClick={() => siderCollapsed.value = !siderCollapsed.value}>
                  <MenuIcon width="24px" color="#a6a6a6" />
                </TextButton>
            </Tooltip>

            {
              globalThis.isElectron ? (
                <div class="main-titleBar"></div>
              ) : ''
            }

            <div class={['main']} ref={scrollEl}>
              <div ref={scrollContentEl}>
                <div class="main-head flex items-center justify-between px-6">
                  <div>
                    {/* <User username="张三" showText={false} size="large" /> */}
                  </div>
                </div>
                
                <RouterView />
              </div>
            </div>
      
            <Templates />

            <Search />
        </div>
    );
  }
});
</script>

<style scoped lang="less">
.home {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.home.siderCollapse :deep(.docs-head) {
  padding-left: 74px; 
}

.sider {
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  padding-top: var(--appBar-padding-top, 0);
  background: var(--home-sider-bg);
  border-right: 1px solid var(--home-sider-borderRight);
  
  transition-duration: 200ms;
  transition-timing-function: ease;
  transition-property: width;
}

.sider.collapse {
  width: 0;
}

.home.siderCollapse .foldButton {
  left: 36px;
  top: 23px;
}

.home.siderCollapse .foldButton.electron {
  top: 45px;
}

.foldButton {
  padding: 1px;
  position: fixed;
  
  top: 38px;
  left: 212px;
  z-index: 3;
}

.foldButton.electron {
  top: 60px; 
}

.main {
  flex: 1;
  min-height: 100%;
  overflow-y: auto;
  padding-top: var(--appBar-padding-top, 0);
}

.main-titleBar {
  content: '';
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  height: 22px;
  background: var(--blur-bg);
  backdrop-filter: blur(4px);
  z-index: 10;
}

.sider-head {
  padding: 36px 20px 0;
}

.menuTitle {
  font-size: 12px;
  font-weight: 500;
  color: var(--light-text-color);
  padding-left: 26px;
  padding-right: 22px;
  margin-bottom: 12px;
}

:root[data-theme="dark"] .logo {
  background-image: url('@/assets/logo3-white.png');
}

.logo {
  width: 140px;
  height: 30px;
  background-image: url('@/assets/logo3.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.searchWrap {
  padding: 0 20px 24px 16px;
}

.searchWrap :deep(.ant-input-group-addon) {
  background: var(--body-bg);
  padding-left: 6px;
  border-color: var(--float-border-color);
}

.searchWrap :deep(.ant-input) {
  background: var(--body-bg);
  border-color: var(--float-border-color);
  padding-left: 0;
  height: 32px;
  line-height: 32px;
  border-left: none;
}


.menus {
  flex: 1;
  margin-top: 24px;
  font-size: 14px;
  font-weight: 500;
  padding-bottom: 48px;
  overflow-y: auto;
  user-select: none;
}

.menus.large {
  padding-left: 30px;
}

.menus.small {
  padding-left: 8px;
}

.menus.smallScreen {
  padding-left: 8px;
}

.customMenu {
  width: 240px!important;
  transition: all .3s ease;
  border-inline-end: none!important;
  background: none!important;
}

.customMenu.large {
  width: 200px;
}

.customMenu.small {
  width: 36px!important;
}

.customMenu.smallScreen {
  width: 190px;
}

.customMenu.small :deep(.ant-menu-item) {
  width: 36px!important;
  height: 36px!important;
  line-height: 36px!important;
  padding-top: 2px!important;
  padding-left: 9px!important;
}

.customMenu.small :deep(.ant-menu-submenu-title) {
  width: 36px!important;
  height: 36px!important;
  line-height: 36px!important;
  padding-top: 2px!important;
  padding-left: 9px!important;
}

.customMenu.smallScreen :deep(.ant-menu-submenu-title) {
  width: 180px;
  padding-left: 5px;
}

.customMenu.smallScreen.large :deep(.ant-menu-item) {
  padding-left: 8px!important;
  padding-right: 28px!important;
}

.customMenu.smallScreen.large :deep(.ant-menu-sub) {
  padding-left: 24px!important;
}

.customMenu.smallScreen.large :deep(.ant-menu-submenu-title) {
  padding-left: 8px!important;
  padding-right: 28px!important;
}

.customMenu :deep(.ant-menu-sub.ant-menu-inline) {
  background: none!important;
}

.customMenu :deep(.ant-menu-item-selected svg) {
  color: #1456f0;
}

.config {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 62px;
  border-top: 1px solid var(--table-border-color);

  padding: 0 22px 0 24px;
  // border-top: 1px solid #eee;
}

.main-head {
  position: sticky;
  background: var(--blur-bg);
  backdrop-filter: blur(4px);
  z-index: 1;
  top: 0;
  height: 0;
  padding-left: 26px;
  padding-right: 24px;
}

.searchInputBox {
  height: 32px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  background: var(--body-bg);
  border: 1px solid var(--float-border-color);
  border-radius: 6px;

  color: var(--text-caption);
  cursor: pointer;
}
</style>