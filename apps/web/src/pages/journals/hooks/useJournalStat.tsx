import { storeToRefs } from 'pinia';
import { watch } from 'vue';

import { useUserStore } from '@/store/user';
import { useContextStore } from '@/store/ui-states/context';
import { useJournalsStore } from '@/store/ui-states/journals/index';

import { useDocWordsCount } from '@editor/Editor/hooks/useDocWordsCount';

import { events } from '@/database/index';

export const useJournalStat = () => {
    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const journalsStore = useJournalsStore();
    const { crtDate } = storeToRefs(journalsStore);

    useDocWordsCount((totalWords: number, totalChars: number, hasMediaBlock: boolean) => {
        if (!totalWords && !totalChars && !hasMediaBlock) {
            events.journalStatDeleted({
                id: crtDate.value?.format('YYYYMMDD'),
            });
        } else {
            events.journalStatUpserted({
                id: crtDate.value?.format('YYYYMMDD'),
                space: crtSpace.value,
                wordsCount: totalWords,
                charCount: totalChars,
                hasMediaBlock: hasMediaBlock,
                creator: user.value?.id,
            });
        }
    });
}