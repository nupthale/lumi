<script setup lang="ts">
import { computed, watchEffect, ref, onMounted } from 'vue';
import { ConfigProvider, theme, Tooltip } from 'ant-design-vue';
import { RouterView } from 'vue-router';
import { useThemeStore } from '@/store/ui-states/theme';
import { storeToRefs } from 'pinia';
import { Loading } from '@zsfe/zsui';
import { useLocalStorage, usePreferredColorScheme } from '@vueuse/core';
import i18next from 'i18next';

import AppNotice from '@/modules/appNotice/index.vue'
import { AppearanceEnum } from '@/modules/setting/interface';
import { switchTheme } from '@/shared/theme';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useOffline } from '@/hooks/useOffline';
import { useOs } from '@/hooks/useOs';

import ImportMask from '@/modules/importMask/index.vue';

import SettingModal from '@/modules/setting/index.vue';

import { useContextStore } from '@/store/ui-states/context';

// 只在Windows平台导入WindowControls
const WindowControls = ref(null);
const { isWindows } = useOs();

const contextStore = useContextStore();
const { fileImportModalVisible } = storeToRefs(contextStore);

// 组件挂载时检测平台并动态导入
watchEffect(async () => {
  if (isWindows.value) {
    import('@/components/WindowControls.vue').then((module) => {
      WindowControls.value = module.default;
      console.log('WindowControls loaded for Windows');
    }).catch((error) => {
      console.error('Failed to load WindowControls:', error);
    });
  }
});

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

// 获取 ant-design-vue 的主题配置
const themeConfig = computed(() => ({
    algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm
}));

const { ready } = useBootstrap();
useOffline();

const preferredColor = usePreferredColorScheme();

const appearanceRef = useLocalStorage('appearance', AppearanceEnum.LIGHT);

// 监听系统主题变化
watchEffect(() => {
  if (appearanceRef.value === AppearanceEnum.SYSTEM) {
    switchTheme(preferredColor.value || AppearanceEnum.LIGHT);
  } else {
    // 以localStorage设置为主， 初始化一下。
    switchTheme(appearanceRef.value || AppearanceEnum.LIGHT);
  }
});

const handleFeedbackClick = () => {
  window.open('https://naldvw0gdio.feishu.cn/share/base/form/shrcnOwjENtQAGWRJZIKTDnN6ed');
}
</script>

<template>
  <ConfigProvider :theme="themeConfig">
      <div class="app-titleBar"></div>
      <component :is="WindowControls" v-if="isWindows && WindowControls" />
      <AppNotice />
      
      <RouterView v-if="ready" />
      <div class="w-full h-full flex items-center justify-center" v-else>
        <Loading style="width: 140px;" />
        <div class="text-lg font-mono">Initializing...</div>
      </div>

      <SettingModal /> 
      
      <ImportMask v-if="fileImportModalVisible"/>
      
      <Tooltip :title="i18next.t('feedback.tooltipTitle')" placement="left">
        <div class="feedback" @click="handleFeedbackClick">
          <!-- <svg width="18px" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="HelpdeskOutlined"><path d="M6 9a6 6 0 1 1 12 0v6.5a5.502 5.502 0 0 1-4.155 5.334A1.5 1.5 0 0 0 12.5 20h-2a1.5 1.5 0 0 0 0 3h2a7.5 7.5 0 0 0 7.5-7.5v.5h.5a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H20A8 8 0 1 0 4 9h-.5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2H6V9Z" fill="currentColor"></path></svg> -->
          
          <svg width="18px" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M940.463158 328.757895C875.789474 158.989474 711.410526 35.031579 517.389474 35.031579 323.368421 35.031579 156.294737 158.989474 91.621053 328.757895c-43.115789 2.694737-75.452632 37.726316-75.452632 80.842105v161.684211c0 43.115789 35.031579 78.147368 75.452632 80.842105 53.894737 140.126316 172.463158 245.221053 320.673684 280.252631 8.084211 18.863158 26.947368 29.642105 48.505263 29.642106h107.789474c29.642105 0 53.894737-24.252632 53.894737-53.894737s-24.252632-53.894737-53.894737-53.894737h-107.789474c-18.863158 0-35.031579 8.084211-43.115789 21.557895-123.957895-32.336842-226.357895-121.263158-274.863158-239.831579 21.557895-13.473684 35.031579-37.726316 35.031579-64.673684v-161.684211c0-26.947368-13.473684-51.2-35.031579-64.673684 59.284211-148.210526 202.105263-253.305263 371.873684-253.305263 167.073684 0 309.894737 102.4 371.873684 250.610526-24.252632 13.473684-40.421053 40.421053-40.421053 70.063158v161.68421c0 43.115789 35.031579 80.842105 80.842106 80.842106 43.115789 0 80.842105-37.726316 80.842105-80.842106v-161.68421c0-43.115789-29.642105-75.452632-67.368421-83.536842z" p-id="2996"></path></svg>
        </div>
    </Tooltip>
  </ConfigProvider>
  
</template>

<style>
.app-titleBar {
  -webkit-app-region: drag;
  height: 22px; /* macOS 标题栏高度 */
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000; /* 确保在其他元素之上 */
}

.feedback {
  position: fixed; 
  right: 0;
  bottom: 130px;
  display: flex;
  align-items: center;
  cursor: pointer;

  z-index: 9999;
  width: 37px;
  height: 36px;
  padding-left: 12px;
  color: rgb(78, 131, 253);
  border-color: rgb(78, 131, 253);
  border-width: 1px 0px 1px 1px;
  border-radius: 50% 0px 0px 50%;
  box-shadow: rgba(31, 35, 41, 0.04) 0px 8px 24px 8px, rgba(31, 35, 41, 0.04) 0px 6px 12px 0px, rgba(31, 35, 41, 0.06) 0px 4px 8px -8px;
}

.feedback:hover {
  color: var(--primary-text-color);
  background: var(--float-bg-hover);
}
</style>