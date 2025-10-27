<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { Pencil } from 'lucide-vue-next';
import { useSubscription } from '@vueuse/rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import count from 'word-count';
import { i18next } from '@editor/i18n';

import { getText } from '@editor/Editor/components/Catalog/util';
import { docInit$, docChanged$ } from '@editor/Editor/event';

 // 千分位展示
const toDigitGroup = (val: number) => {
    return Number(val).toLocaleString('en-US');
}

export default defineComponent({
    setup() {
        const totalWords = ref(0);
        const totalChars = ref(0);

        const updateStatistics = (text) => {
            totalWords.value = count(text);
            totalChars.value = text.length;
        }

        useSubscription(
            docInit$.pipe(
                tap(({ doc, text }) => {
                    const title = getText(doc.content?.[0]?.content);

                    const bodyText = title ? text.replace(title, '') : text;

                    updateStatistics(bodyText);
                })
            ).subscribe()
        );

        useSubscription(
            docChanged$.pipe(
                debounceTime(600),
                tap(({ doc, text }) => {
                    const title = getText(doc.content?.[0]?.content);

                    const bodyText = title ? text.replace(title, '') : text;

                    updateStatistics(bodyText);
                })
            ).subscribe()
        );

        return () => (totalWords.value || totalChars.value ) ? (
            <div class="doc-statistics px-3 py-2">
                <div class="flex items-center">
                    <Pencil class="mr-2" size={14} />
                    <div class="lightText mr-3">
                        {i18next.t('editor.statistics.words', {
                            count: toDigitGroup(totalWords.value)
                        })}
                    </div>
                    <div class="lightText">
                        {i18next.t('editor.statistics.chars', {
                            count: toDigitGroup(totalChars.value)
                        })}
                    </div>
                </div>
            </div>
        ) : '';
    }
});
</script>

<style scoped>
.doc-statistics {
    color: var(--light-text-color);
    border-top: 1px solid var(--default-border-color);

    font-size: 14px;
}
</style>