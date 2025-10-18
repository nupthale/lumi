<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { storeToRefs } from 'pinia';
import { debounceTime, filter, tap, switchMap } from 'rxjs/operators';
import i18next from 'i18next';

import { docChanged$, docInit$ } from '@editor/Editor/event'; 
import { useContextStore } from '@/store/ui-states/context';
import { getText } from '@editor/Editor/components/Catalog/util';

import { events } from '@/database/index';

enum SaveStatusEnum {
    INIT = 'init',
    SAVING = 'saving',
    SUCCESS = 'success',
    ERROR = 'error',
}

export default defineComponent({
  props: {
    id: String,
    fileId: String,
  },  
  setup(props) {
    const statusRef = ref(SaveStatusEnum.INIT);

    const titleRef = ref('');

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    useSubscription(
        docInit$.pipe(
            tap(({ doc }) => {
                titleRef.value = getText(doc.content?.[0]?.content) || i18next.t('doc.head.titlePlaceholder');
            }),
        ).subscribe(),
    );

    useSubscription(
        docChanged$.pipe(
            tap(({ doc }) => {
                titleRef.value = getText(doc.content?.[0]?.content) || i18next.t('doc.head.titlePlaceholder');
            }),
            debounceTime(400),
            tap(() => statusRef.value = SaveStatusEnum.SAVING),
            switchMap(async ({ doc }) => {
                try {
                    const title = getText(doc.content?.[0]?.content);
                    const updatedAt = new Date();

                    events.fileUpdated({
                        id: props.fileId,
                        title,
                        updatedAt
                    });

                    setTimeout(() => {
                        statusRef.value = SaveStatusEnum.SUCCESS;
                    }, 500);
                } catch(e) {
                    statusRef.value = SaveStatusEnum.ERROR;

                    console.error(e);
                }
            })
        ).subscribe()
    );

    const renderStatusText = computed(() => {
        if (statusRef.value === SaveStatusEnum.SAVING) {
            return i18next.t('doc.head.saving');
        }

        if (statusRef.value === SaveStatusEnum.SUCCESS) {
            return i18next.t('doc.head.saved');
        }

        if (statusRef.value === SaveStatusEnum.ERROR) {
            return i18next.t('doc.head.saveFailed');
        }
    })

    return () => (
        <div>
            <div>{titleRef.value || ''}</div>
            <div class="doc-autosave">
                {renderStatusText.value}
            </div>
        </div>
    );
  }
});
</script>

<style scoped>
.doc-autosave {
    font-size: 12px;
    color: var(--light-text-color);
}
</style>