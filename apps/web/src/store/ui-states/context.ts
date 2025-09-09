import { ref } from 'vue';

import { defineStore } from 'pinia';

export const useContextStore = defineStore('context', () => {    
    // state
    const crtSpace = ref('');

    const crtEditSpace = ref('');

    const editSpaceModalVisible = ref(false);

    const settingModalVisible = ref(false);

    const searchModalVisible = ref(false);

    // 因为doc资源比较大， 动态import比较耗时， 加个loading
    const docResLoading = ref(false);

    // actions
    const setCrtSpace = (spaceId: string) => {
        crtSpace.value = spaceId;
    };

    const setCrtEditSpace = (spaceId: string) => {
        crtEditSpace.value = spaceId;
    }

    const setEditSpaceModalVisible = (visible: boolean) => {
        editSpaceModalVisible.value = visible;
    }

    const setSettingModalVisible = (visible: boolean) => {
        settingModalVisible.value = visible;
    }

    const setSearchModalVisible = (visible: boolean) => {
        searchModalVisible.value = visible;
    }

    const setDocResLoading = (loading: boolean) => {
        docResLoading.value = loading;
    }

    return {
        crtSpace,
        setCrtSpace,
        settingModalVisible,

        crtEditSpace,
        setCrtEditSpace,

        docResLoading,
        setDocResLoading,

        searchModalVisible,
        setSearchModalVisible,

        editSpaceModalVisible,
        setEditSpaceModalVisible,
        setSettingModalVisible,
    };
});