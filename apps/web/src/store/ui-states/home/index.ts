import { ref } from 'vue';

import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', () => {    
    // state
    const selectedTag = ref(null);

    const searchText = ref('');

    // 收藏筛选
    const onlyFavorites = ref(false);

    // 侧边新建模版展示
    const createDocDrawerVisible = ref(false);

    // 创建、编辑wiki弹窗展示
    const createWikiModalVisible = ref(false);

    // 编辑的wiki item
    const editWikiItem = ref({});

    // actions
    const setSelectedTag = (tag) => {
        selectedTag.value = tag;
    };

    const setSearchText = (text) => {
        searchText.value = text;
    }

    const setOnlyFavorites = (value) => {
        onlyFavorites.value = value;
    };

    const setCreateDocDrawerVisible = (value) => {
        createDocDrawerVisible.value = value;
    };
    
    const setCreateWikiModalVisible = (value) => {
        createWikiModalVisible.value = value;
    };

    const setEditWikiItem = (item) => {
        editWikiItem.value = {
            ...item,
            // 默认的cover
            cover: item.cover || 'https://fastly.picsum.photos/id/507/160/220.jpg?hmac=Z8Z1L-Kysv4EqSC1otXyCR2tQABHqadAa5pe5b7fETQ',
        };
    };

    return {
        selectedTag,
        setSelectedTag,

        searchText,
        setSearchText,

        onlyFavorites,
        setOnlyFavorites,

        createDocDrawerVisible,
        setCreateDocDrawerVisible,

        createWikiModalVisible,
        setCreateWikiModalVisible,

        editWikiItem,
        setEditWikiItem,
    };
});