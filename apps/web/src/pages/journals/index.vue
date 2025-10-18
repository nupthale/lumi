<script lang="tsx">
import { defineComponent, ref, h, watch } from 'vue';
import i18next from 'i18next';
import { storeToRefs } from 'pinia';
import { Loading } from '@zsfe/zsui';
import dayjs, { Dayjs } from 'dayjs';

import { Editor } from '@editor/index';
import { useDoc } from '@/store/queries/docs/useDoc';
import { useUserStore } from '@/store/user';
import { useJournals } from '@/store/queries/docs/useJournals';
import { uniqueId } from '@/shared/id';
import { events } from '@/database/index';
import { createDoc } from '@/shared/yjs';
import { SpaceAssetType } from '@/database/schema/spaceAsset';

import DocLoadErrorIllustration from '@/components/icons/DocLoadErrorIllustration.vue';
import { useContextStore } from '@/store/ui-states/context';

import { useBlockSystemSave } from '@/hooks/useBlockSystemSave';

import CalendarBar from './modules/CalendarBar/index.vue';
import DocMeta from './modules/Meta/index.vue';

import { AppModeEnum } from '@/types/setting';

import '@editor/index.css';

import { getDefaultDoc } from './defaultDoc';

export default defineComponent({
  setup() {
    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const { journals, isLoading } = useJournals(crtSpace);

    const fileIdRef = ref('');

    watch(journals, () => {
      if (!fileIdRef.value) {
        handleSelectDate(dayjs());
      }
    });

    const { doc, pending, error } = useDoc(fileIdRef);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    useBlockSystemSave();

    const handleAddEmptyDoc = async (title: string) => {
      try {
          const fileId = uniqueId();

          if (!user.value?.id) {
            throw Error('用户不存在');
          }

          await createDoc(fileId, getDefaultDoc(title));

          events.fileCreated({
              id: fileId,
              type: 'Doc',
              title,
              cover: '',
              creator: user.value?.id,
          });

          events.spaceAssetsCreated({
              id: uniqueId(),
              space: crtSpace.value,
              asset: fileId,
              type: SpaceAssetType.JOURNAL,
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
          fileIdRef.value = file?._id || '';
        } else {
          fileIdRef.value = await handleAddEmptyDoc(fileName);
        }
      } catch(e) {
        console.error(e);
      }
    };

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

      return (
        <Editor
            key={doc.value?.fileId}
            style={{ paddingTop: paddingTop }}
            user={user.value}
            doc={doc.value}
            docMetaComponent={docMetaComponent}
            isLocalMode={window.__appMode__ === AppModeEnum.LOCAL}
        >
          {{
            header: () => '',
          }}
        </Editor>
      );
    }

    return () => (
        <div class="relative">
          <div class="calendarBarWrap sticky top-0" style={{ marginTop: globalThis.isElectron ? '-22px' : '0', top: globalThis.isElectron ? '-22px' : 0 }}>
            <CalendarBar journals={journals.value} onSelectDate={handleSelectDate} />
          </div>
          {renderBody({ paddingTop: '0' })}
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
  z-index: 1000;
  background: var(--body-bg);

  background: var(--blur-bg-filter);
  backdrop-filter: saturate(1.5) blur(16px);
}
</style>