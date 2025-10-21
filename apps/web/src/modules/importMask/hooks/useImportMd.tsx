

import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import i18next from 'i18next';

import { useContextStore } from '@/store/ui-states/context';
import { useUserStore } from '@/store/user';
import { createDocFile } from '@/shared/file';

import { markdownToBlock } from '@editor/Editor/plugins/markdown/markdownToBlock';

export const useImportMd = () => {
    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const importMd = async (title: string, md: string) => {
        try {
            const node = await markdownToBlock(md);
            const json = node.toJSON();

            await createDocFile({
                title,
                content: json, 
                userId: user.value.id,
                spaceId: crtSpace.value,
            });

            contextStore.setFileImportModalVisible(false);

        } catch(e) {
            message.error(i18next.t('import.parseJsonError'));
            console.error(e);
        }
    }

    return {
        importMd,
    };
}