import { createRouter, createWebHashHistory } from 'vue-router'

import { useContextStore } from '../store/ui-states/context';
import { useUserStoreWithout } from '../store/user';

import { AppModeEnum } from '../types/setting';

const router = createRouter({
  // electron用hash比较简单
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/home/index.vue'),
      redirect: '/files',
      children: [{
        path: 'files',
        name: 'files',
        component: () => import('../pages/files/index.vue'),
        children: [{
          path: 'doc/:fileId',
          name: 'doc',
          component: () => import('../pages/doc/index.vue'),
        }]
      }, {
        path: 'wikis',
        name: 'wikis',
        component: () => import('../pages/wikis/index.vue'),
        children: [{
          path: 'wiki/:wikiId',
          name: 'wiki',
          component: () => import('../pages/wiki/index.vue'),
          children: [{
            path: 'doc/:fileId',
            name: 'wikiDoc',
            component: () => import('../pages/wiki/modules/Doc/index.vue'),
          }]
        }]
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/login/index.vue'),
    },
  ]
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStoreWithout();
  const contextStore = useContextStore();

  if (!userStore.user) {
    const success = await userStore.initUser();

    if (!success && window.__appMode__ !== AppModeEnum.LOCAL) {
      return { name: 'login' };
    }
  } else {
    // 如果是加载文档页面，显示 loading
    if (to.name === 'doc' || to.name === 'wikiDoc') {
      contextStore.setDocResLoading(true);
    }
  }
});

router.afterEach((to) => {
  const contextStore = useContextStore();
  
  // 路由加载完成后停止 loading
  if (to.name === 'doc' || to.name === 'wikiDoc') {
    contextStore.setDocResLoading(false);
  }
});

export default router