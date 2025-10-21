

import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import i18next from 'i18next';
import { useRoute } from 'vue-router';

import { useContextStore } from '@/store/ui-states/context';
import { useJournalsStore } from '@/store/ui-states/journals/index';
import { useUserStore } from '@/store/user';
import { createDocFile, createJournal } from '@/shared/file';

export const useImportJson = () => {
    const route = useRoute();

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const journalsStore = useJournalsStore();
    const { crtDate } = storeToRefs(journalsStore);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const importJson = async (content: string) => {
        try {
            const json = JSON.parse(content);
            let title = json.title;

            if (!json.doc) {
                throw Error('doc is required');
            }

            if (route.name === 'journals') {
                // journal不能直接像一样插入，因为日期唯一， 要更新覆盖， 暂时先不做了。
                // title = crtDate.value?.format('YYYYMMDD');
                // json.doc.content[0].attrs.editable = 'false';
                // json.doc.content[0].content[0].text = title;

                // await createJournal({
                //     title,
                //     content: json.doc,
                //     collectionMap: json.collections,
                //     userId: user.value.id,
                //     spaceId: crtSpace.value,
                // });
            } else {
                await createDocFile({
                    title,
                    content: json.doc, 
                    collectionMap: json.collections,
                    userId: user.value.id,
                    spaceId: crtSpace.value,
                });
            }

            contextStore.setFileImportModalVisible(false);

        } catch(e) {
            message.error(i18next.t('import.parseJsonError'));
            console.error(e);
        }
    }

    return {
        importJson,
    };
}