import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { events } from '@/database/index';
import { useHomeStore } from '@/store/ui-states/home';
import { useContextStore } from '@/store/ui-states/context';
import { queryClient } from '@/store/queries/client';

export const useFileAction = () => {
  const homeStore = useHomeStore();

  const contextStore = useContextStore();
  const { crtSpace } = storeToRefs(contextStore);

  const handleAddWiki = async () => {
    try {
        homeStore.setEditWikiItem({
          cover: 'https://fastly.picsum.photos/id/972/420/240.jpg?hmac=7fRQTviDi8ma-mG32YPkl9HJUtITF_raJPV4cH9d_dA',
        });
        homeStore.setCreateWikiModalVisible(true);
    } catch(e) {
        console.error(e);
    }
  };

  const handleEditWiki = async (wiki) => {
    try {
        homeStore.setEditWikiItem({
          ...wiki,
        });
        homeStore.setCreateWikiModalVisible(true);
    } catch(e) {
        console.error(e);
    }
  };

  const handleDeleteWiki = async (id: string) => {
    Modal.confirm({
      title: '确定删除该文档集？',
      content: '删除后，文档集下的所有文档将无法恢复',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        try {
          // wiki下删了就行了， 其他都是软删除， 访问不到
          events.wikiDeleted({
            id,
          });
          
          message.success('删除成功');
        } catch(e) {
            console.error(e);
        }
      }
    });
  };

  const handleFavoriteClick = async (wiki) => {

    try {
      events.wikiUpdated({
        id: wiki.id,
        favorite: !wiki.favorite, 
      });

      message.success('更新成功');

      // 重新请求docs
      queryClient.invalidateQueries(['wikis', crtSpace.value]);
    } catch(e) {
        console.error(e);
    }
  }

  return { 
    handleAddWiki, 
    handleEditWiki,
    handleDeleteWiki,
    handleFavoriteClick,
  };
}