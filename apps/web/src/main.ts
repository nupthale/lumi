import { createApp } from 'vue'
import { message } from 'ant-design-vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { queryClient } from '@/store/queries/client';
import { store } from '@/store/index';

import App from './App.vue'
import router from './router/index'

import { initI18n } from '@/i18n/index';
import '@/shared/electron';
import '~/design/token.css';
import './style.css';
import './design/custom.css';
import './design/he-tree.less';

import '~/design/ant/index.less';
import '@zsfe/zsui/es/style.css';

import { AppModeEnum } from './types/setting';

message.config({
    maxCount: 1,
});

const bootstrap = async () => {
    await initI18n();

    const machineId = await window.clientAPI?.getMachineId();
    window.__machineId__ = machineId;

    // 如果是浏览器环境， 只有sync， 如果是electron， 默认local
    // 后续如果有api-server， 如果localStorage是sync， 则需要请求验证一下， 否则就local。
    window.__appMode__ = window.isElectron ? localStorage.getItem('appMode') || AppModeEnum.LOCAL : AppModeEnum.SYNC;

    const app = createApp(App);

    app.use(VueQueryPlugin, {
        queryClient,
    });

    app.use(store);

    app.use(router);

    await router.isReady();

    app.mount('#app');
};

bootstrap();


