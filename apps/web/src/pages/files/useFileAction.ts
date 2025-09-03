import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { events } from '@/database/index';
import { useHomeStore } from '@/store/ui-states/home';

import { uniqueId } from '@/shared/id';
import { useContextStore } from '@/store/ui-states/context';
import { useUserStore } from '@/store/user';
import { SpaceAssetType } from '@/database/schema/spaceAsset';

import { createDoc } from '@/shared/yjs';
import { defaultDoc } from '@editor/doc';

export const useFileAction = () => {
  const router = useRouter();

  const homeStore = useHomeStore();

  const contextStore = useContextStore();
  const { crtSpace } = storeToRefs(contextStore);

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const handleAddEmptyDoc = async () => {
    try {
        const fileId = uniqueId();

        if (!user.value?.id) {
          throw Error('用户不存在');
        }

        await createDoc(fileId, defaultDoc);

        events.fileCreated({
            id: fileId,
            type: 'Doc',
            title: '',
            cover: '',
            creator: user.value?.id,
        });

        events.spaceAssetsCreated({
            id: uniqueId(),
            space: crtSpace.value,
            asset: fileId,
            type: SpaceAssetType.FILE,
        });

        // 跳转到新建的doc
        router.push(`/files/doc/${fileId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDocByTemplate = async () => {
    homeStore.setCreateDocDrawerVisible(true);
  }

  const handleDeleteFile = async (file) => {
    try {
        events.fileDeleted({
          id: file._id,
        });

        events.spaceAssetsDeleted({
          asset: file._id,
        });

        message.success('删除成功');
    } catch(e) {
        console.error(e);
    }
  };

  const handleFavoriteClick = async (e: MouseEvent, file, favorite: boolean) => {
    e.stopPropagation();

    try {
      events.fileUpdated({
        id: file._id,
        favorite,
      })

      message.success('更新成功');
    } catch(e) {
        console.error(e);
    }
  }

  return { 
    handleAddEmptyDoc, 
    handleAddDocByTemplate,
    handleDeleteFile,
    handleFavoriteClick,
  };
}