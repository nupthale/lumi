import { ref } from 'vue';

import { defineStore } from 'pinia';
import i18next from 'i18next';

import { store } from './index';

import type { UserType } from '@editor/Editor/interface';

import { getUser } from '#/user';

import { AppModeEnum } from '../types/setting';

export const useUserStore = defineStore('user', () => {
    // state
    const userRef = ref<UserType | null>(null);

    // actions
    const setUser = (user: UserType) => {
        userRef.value = user;
    };

    const initUser = async () => {
        try {
            if (window.__appMode__ === AppModeEnum.LOCAL) {
                const aliasName = await window.clientAPI.getSetting('aliasName');

                const randomName = `${i18next.t('common.guest')}${window.__machineId__?.slice(-2)?.toUpperCase()}`;

                userRef.value = {
                    id: window.__machineId__,
                    name: aliasName || randomName,
                };

                return true;
            }

            const { result } = await getUser();

            userRef.value = {
                ...result,
                id: result._id,
            };
            return true;
        } catch(e) {
            console.error(e);
        }
    }

    return {
        user: userRef,
        setUser,
        initUser,
    };
});

export const useUserStoreWithout = () => {
    return useUserStore(store);
}