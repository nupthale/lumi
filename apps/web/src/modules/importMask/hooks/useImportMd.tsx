import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import i18next from 'i18next';
import { useRoute } from 'vue-router';

import { useContextStore } from '@/store/ui-states/context';
import { useUserStore } from '@/store/user';
import { createDocFile, createJournal, deleteJournal } from '@/shared/file';
import { useJournalsStore } from '@/store/ui-states/journals/index';
import { useJournals } from '@/store/queries/docs/useJournals';

import { markdownToBlock } from '@editor/Editor/plugins/markdown/markdownToBlock';
import { uniqueId } from '../../../shared/id';
import { switchFile$ } from '@/pages/journals/event';

export const useImportMd = () => {
    const route = useRoute();

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const journalsStore = useJournalsStore();
    const { crtDate } = storeToRefs(journalsStore);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const { journals } = useJournals(crtSpace);

    const importMd = async (title: string, md: string) => {
        try {
            const node = await markdownToBlock(md);
            const json = node.toJSON();

            if (route.name === 'journals') {
                // journal不能直接像一样插入，因为日期唯一， 要更新覆盖
                title = crtDate.value?.format('YYYYMMDD');
                const titleNode = json.content[0];

                titleNode.attrs.id = uniqueId();
                titleNode.attrs.editable = 'false';
                titleNode.content = [{
                    type: 'text',
                    text: title,
                }];

                const existJournal = journals.value.find((item) => item.title === title);

                const { fileId } = await createJournal({
                    title,
                    content: json,
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
                const titleNode = json.content[0];

                titleNode.attrs.id = uniqueId();
                titleNode.content = [{
                    type: 'text',
                    text: title,
                }];

                await createDocFile({
                    title,
                    content: json, 
                    userId: user.value.id,
                    spaceId: crtSpace.value,
                });
            }

            contextStore.setFileImportModalVisible(false);

        } catch(e) {
            message.error(i18next.t('import.parseMdError'));
            console.error(e);
        }
    }

    return {
        importMd,
    };
}