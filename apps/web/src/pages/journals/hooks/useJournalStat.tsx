import { storeToRefs } from 'pinia';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { useContextStore } from '@/store/ui-states/context';
import { useJournalStats } from '@/store/queries/docs/useJournalStats';

import { docInit$, docChanged$ } from '@editor/Editor/event';

export const useJournalStat = () => {
    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const { journalStats } = useJournalStats(crtSpace);

    const updateJournalStat = () => {

    }

    useSubscription(
        docInit$.pipe(
            tap(() => {
                updateJournalStat();
            })
        ).subscribe()
    );

    useSubscription(
        docChanged$.pipe(
            tap(() => {
                updateJournalStat();
            })
        ).subscribe()
    );
}