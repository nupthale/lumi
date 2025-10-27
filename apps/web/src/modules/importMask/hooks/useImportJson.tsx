

import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import i18next from 'i18next';
import { useRoute } from 'vue-router';

import { useContextStore } from '@/store/ui-states/context';
import { useJournalsStore } from '@/store/ui-states/journals/index';
import { useUserStore } from '@/store/user';
import { createDocFile, createJournal, deleteJournal } from '@/shared/file';
import { useJournals } from '@/store/queries/docs/useJournals';
import { switchFile$ } from '@/pages/journals/event';

export const useImportJson = () => {
    const route = useRoute();

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const journalsStore = useJournalsStore();
    const { crtDate } = storeToRefs(journalsStore);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const { journals } = useJournals(crtSpace);

    const importJson = async (content: string) => {
        try {
            const json = JSON.parse(content);
            let title = json.title;

            if (!json.doc) {
                throw Error('doc is required');
            }

            if (route.name === 'journals') {
                // journal不能直接像一样插入，因为日期唯一， 要更新覆盖
                title = crtDate.value?.format('YYYYMMDD');
                json.doc.content[0].attrs.editable = 'false';
                json.doc.content[0].content[0].text = title;

                const existJournal = journals.value.find((item) => item.title === title);

                const { fileId } = await createJournal({
                    title,
                    content: json.doc,
                    collectionMap: json.collections,
                    userId: user.value.id,
                    spaceId: crtSpace.value,
                });

                if (existJournal) {
                    // 先插入一条新的，然后删除老的
                    const id = existJournal._id;
                    await deleteJournal(id);
                }

                switchFile$.next({ fileId });
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