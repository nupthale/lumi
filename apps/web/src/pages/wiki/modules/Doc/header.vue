<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { storeToRefs } from 'pinia';
import { debounceTime, filter, tap, switchMap } from 'rxjs/operators';
import i18next from 'i18next';
import { useLocalStorage } from '@vueuse/core';

import { events } from '@/database/index';
import { queryClient } from '@/store/queries/client';
import { appBarHeight } from '@/shared/electron';
import { docChanged$, docInit$ } from '@editor/Editor/event'; 
import { useContextStore } from '@/store/ui-states/context';
import { getText } from '@editor/Editor/components/Catalog/util';

import Actions from '../../../doc/modules/Actions.vue';

enum SaveStatusEnum {
    INIT = 'init',
    SAVING = 'saving',
    SUCCESS = 'success',
    ERROR = 'error',
}

export default defineComponent({
  props: {
    id: String,
    wikiId: String,
    fileId: String,
  },  
  setup(props) {
    const statusRef = ref(SaveStatusEnum.INIT);

    const titleRef = ref('');

    const siderCollapsed = useLocalStorage('wiki-siderCollapsed', false);

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
                    // const updatedAt = new Date();

                    events.fileUpdated({
                        id: props.fileId,
                        title,
                    });

                    statusRef.value = SaveStatusEnum.SUCCESS;

                    queryClient.invalidateQueries(['wiki', props.wikiId]);
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
        <div class="header" style={{ height: `calc(64px + ${appBarHeight}px)`, paddingTop: `${appBarHeight}px` }}>
            <div style={{ paddingLeft: siderCollapsed.value ? '32px' : '0' }}>
                <div>{titleRef.value || ''}</div>
                <div class="doc-autosave">
                    {renderStatusText.value}
                </div>
            </div>
            <Actions />
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

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    z-index: 50;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: var(--blur-bg-filter);
    padding: 0 12px;
    padding: .4rem .9rem .4rem .9rem;
    backdrop-filter: saturate(1.5) blur(16px);
    border-bottom: 1px solid var(--default-border-color);
}


.title {
    font-weight: 500;
    font-size: 16px;
}

.divider {
    width: 1px;
    height: 18px;
    background: #e8e8e8;
    margin: 0 8px;
}
</style>