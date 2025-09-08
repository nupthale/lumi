<script lang="tsx">
import { defineComponent, ref, h, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import i18next from 'i18next';
import { storeToRefs } from 'pinia';
import { Loading } from '@zsfe/zsui';

import FullScreenModal from '@/components/FullScreenModal/index.vue';
import { Editor } from '@editor/index';
import { useDoc } from '@/store/queries/docs/useDoc';
import { useUserStore } from '@/store/user';
import { useFiles } from '@/store/queries/docs/useFiles';

import DocLoadErrorIllustration from '@/components/icons/DocLoadErrorIllustration.vue';
import { useContextStore } from '@/store/ui-states/context';

import { useBlockSystemSave } from '@/hooks/useBlockSystemSave';
import { useFileSearchIndex } from '@/hooks/useFileSearchIndex';

import Title from './modules/Title.vue';
import DocMeta from './meta/index.vue';
import { useOnlineUsers } from './hooks/useOnlineUsers';

import UserGroup from './modules/UserGroup.vue';
import Header from './modules/Header.vue';
import { AppModeEnum } from '@/types/setting';

import '@editor/index.css';

export default defineComponent({
  setup(props) {
    const route = useRoute();

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const { files, tags } = useFiles(crtSpace);

    const fileIdRef = ref(route.params.fileId as string);

    const { onlineUsers } = useOnlineUsers();

    useFileSearchIndex(fileIdRef);

    // Watch for route param changes
    watch(() => route.params.fileId, (newId) => {
      fileIdRef.value = newId as string;
    });

    const router = useRouter();

    const { doc, pending, error } = useDoc(fileIdRef);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    useBlockSystemSave();

    const handleBack = () => {
      router.replace('/files');
    }

    const renderBody = ({ paddingTop }: { paddingTop: string }) => {
      if (pending.value) {
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
            allTags: tags.value,
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
            header: () => <Header file={doc.value} />,
          }}
        </Editor>
      );
    }

    return () => (
        <FullScreenModal visible onClose={() => handleBack()}>
          {{
            title: () => <Title id={doc.value?.id} fileId={fileIdRef.value} />,
            actions: () => (
              <div class="h-[28px]">
                  <UserGroup users={onlineUsers.value} maxCount={10} />
              </div>
            ),
            default: (params) => renderBody(params),
          }}
        </FullScreenModal>
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
</style>