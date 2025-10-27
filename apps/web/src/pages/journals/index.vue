<script lang="tsx">
import { defineComponent, ref, h, watch } from 'vue';
import i18next from 'i18next';
import { storeToRefs } from 'pinia';
import { Loading } from '@zsfe/zsui';
import dayjs, { Dayjs } from 'dayjs';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { Editor } from '@editor/index';
import { useDoc } from '@/store/queries/docs/useDoc';
import { useUserStore } from '@/store/user';
import { useJournals } from '@/store/queries/docs/useJournals';

import DocLoadErrorIllustration from '@/components/icons/DocLoadErrorIllustration.vue';
import { useContextStore } from '@/store/ui-states/context';

import { useBlockSystemSave } from '@/hooks/useBlockSystemSave';

import CalendarBar from './modules/CalendarBar/index.vue';
import DocMeta from './modules/Meta/index.vue';

import { AppModeEnum } from '@/types/setting';

import { formatDate } from '@/shared/date';
import { createJournal } from '@/shared/file';
import { useJournalsStore } from '@/store/ui-states/journals/index';

import { useJournalStat } from './hooks/useJournalStat';

import '@editor/index.css';

import { getDefaultDoc } from './defaultDoc';

import { switchFile$ } from './event';

export default defineComponent({
  setup() {
    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const journalsStore = useJournalsStore();
    const { crtFileId } = storeToRefs(journalsStore);

    const { journals, isLoading } = useJournals(crtSpace);

    useJournalStat();

    watch([journals], () => {
      if (!crtFileId.value && crtSpace.value ) {
        handleSelectDate(dayjs());
      }
    });

    const { doc, pending, error } = useDoc(crtFileId);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    useBlockSystemSave();

    const handleAddEmptyDoc = async (title: string) => {
      try {
          const { fileId } = await createJournal({
              title, 
              content: getDefaultDoc(title), 
              userId: user.value?.id,
              spaceId: crtSpace.value,
          });

          return fileId;
      } catch (error) {
        console.error(error);
      }
    };

    const handleSelectDate = async (date: Dayjs) => {
      try {
        const fileName = date.format('YYYYMMDD');

        const file = journals.value.find(item => item.title === fileName);

        if (file) {
          journalsStore.setCrtFileId(file?._id || '');
        } else {
          const newFileId = await handleAddEmptyDoc(fileName);
          journalsStore.setCrtFileId(newFileId);
        }
      } catch(e) {
        console.error(e);
      }
    };

    useSubscription(
      switchFile$.pipe(
        tap(({ fileId }) => {
          journalsStore.setCrtFileId(fileId);
        })
      ).subscribe()
    )

    const renderBody = ({ paddingTop }: { paddingTop: string }) => {
      if (pending.value || isLoading.value) {
        return (
          <div class="docs-empty" style={{ width: '140px', paddingTop: paddingTop }}>
            <Loading style="width: 140px" />
          </div>
        );
      }

      if (error.value || !doc.value) {
        return (
          <div class="docs-empty" style={{ paddingTop: paddingTop }}>
            <div class="docs-empty_illustration ">
              <DocLoadErrorIllustration />
            </div>
            <div class="docs-empty_text">
              {i18next.t('doc.loadFailed')}
            </div>
          </div>
        );
      }

      const docMetaComponent = defineComponent({
        setup() {
          return () => h(DocMeta, {
            doc: doc.value,
            user: user.value,
          })
        }
      });

      const titleFormatter = (text) => {
        return formatDate(dayjs(text));
      }

      return (
        <Editor
            key={doc.value?.fileId}
            style={{ paddingTop: paddingTop }}
            user={user.value}
            doc={doc.value}
            docMetaComponent={docMetaComponent}
            titleFormatter={titleFormatter}
            isLocalMode={window.__appMode__ === AppModeEnum.LOCAL}
        >
          {{
            header: () => '',
          }}
        </Editor>
      );
    }

    return () => (
        <div class="relative w-full h-screen journalPage">
          <div class="calendarBarWrap sticky top-0 z-0" style={{ marginTop: globalThis.isElectron ? '-22px' : '0', top: globalThis.isElectron ? '-22px' : 0 }}>
            <CalendarBar journals={journals.value} onSelectDate={handleSelectDate} />
          </div>
          <div class="absolute top-0 left-0 right-0 bottom-0 pt-[160px]">
            {renderBody({ paddingTop: '0' })}
          </div>
        </div>
    );
  }
});
</script>

<style scoped lang="less">
.docs-loading {
    text-align: center;
    margin: calc(50vh - 100px) auto;
    width: 140px;
    left: 0;
    right: 0;
}

.docs-empty {
    text-align: center;
    margin: 200px auto;
    width: 400px;
    left: 0;
    right: 0;
}

.docs-empty_illustration {
    display: flex;
    justify-content: center;
}

.docs-empty_text {
    color: var(--light-text-color);
}

.calendarBarWrap {
  z-index: 100;
  background: var(--body-bg);
  height: 160px;

  background: var(--blur-bg-filter);
  backdrop-filter: saturate(1.5) blur(16px);
}

.journalPage :deep(.doc-comments_title) {
  top: 0;
}
</style>