import { ref } from 'vue';
import count from 'word-count';
import { useSubscription } from '@vueuse/rxjs';
import { tap, debounceTime } from 'rxjs/operators';

import { getText } from '@editor/Editor/components/Catalog/util';
import { docInit$, docChanged$ } from '@editor/Editor/event';

export const useDocWordsCount = (onUpdate?: (totalWords: number, totalChars: number, hasMediaBlock: boolean) => void) => {
    const totalWords = ref(0);
    const totalChars = ref(0);

    const hasMediaBlock = ref(false);

    const updateStatistics = (text, doc) => {
        totalWords.value = count(text);
        totalChars.value = text.length;

        const body = doc.content?.[1];

        let mediaBlock = false;

        body.content.forEach(block => {
            if (['collection', 'image', 'video', 'iframe'].includes(block.type)) {
                mediaBlock = true;
            }
        });

        hasMediaBlock.value = mediaBlock;

        onUpdate?.(totalWords.value, totalChars.value, hasMediaBlock.value);
    }

    useSubscription(
        docInit$.pipe(
            tap(({ doc, text }) => {
                const title = getText(doc.content?.[0]?.content);

                const bodyText = title ? text.replace(title, '') : text;

                updateStatistics(bodyText, doc);
            })
        ).subscribe()
    );

    useSubscription(
        docChanged$.pipe(
            debounceTime(600),
            tap(({ doc, text }) => {
                const title = getText(doc.content?.[0]?.content);

                const bodyText = title ? text.replace(title, '') : text;

                updateStatistics(bodyText, doc);
            })
        ).subscribe()
    );

    return {
        totalWords,
        totalChars,
        hasMediaBlock,
    };
}