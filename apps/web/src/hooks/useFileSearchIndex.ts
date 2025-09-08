import { ref } from 'vue';
import type { Ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { docChanged$, updateCollectionsMap$ } from '@editor/Editor/event';

import { updateFileSearchIndex$ } from '../worker/search/event';

export const useFileSearchIndex = (fileId: Ref<string>) => {
    // Store latest values
    const latestDocRef = ref<string>('');
    const lastestCollectionsTextRef = ref<string[]>([]);

    const updateFileSearchIndex = () => {
        updateFileSearchIndex$.next({
            fileId: fileId.value,
            docText: latestDocRef.value || '',
            collectionsText: lastestCollectionsTextRef.value || [],
        });
    }

    useSubscription(
        docChanged$.pipe(
            tap(({ text }) => {
                latestDocRef.value = text;

                updateFileSearchIndex();
            })
        ).subscribe()
    );

    useSubscription(
        updateCollectionsMap$.pipe(
            tap(({ collections }) => {
                let collectionsText: string[] = [];

                Object.keys(collections).forEach(key => {
                    const collection = collections[key];

                    const titles = collection.schema?.columns?.map(col => {
                        collectionsText.push(col.title);
                    });
                    
                    
                    const values = collection.values || [];
                    values.forEach(row => {
                        Object.keys(row).forEach(colKey => {
                            if (colKey === 'id' || !`${row[colKey]}`?.length) {
                                return;
                            }
                            
                            collectionsText.push(row[colKey]);
                        });
                    });

                    lastestCollectionsTextRef.value = collectionsText;
                })
            })
        ).subscribe()
    )
}