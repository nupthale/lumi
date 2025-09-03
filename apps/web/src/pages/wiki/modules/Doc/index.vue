<script lang="tsx">
import { defineComponent, ref, h, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Loading } from '@zsfe/zsui';
import i18next from 'i18next';

import FullScreenModal from '@/components/FullScreenModal/index.vue';

import { Editor } from '@editor/index';

import DocLoadErrorIllustration from '@/components/icons/DocLoadErrorIllustration.vue';
import { useDoc } from '@/store/queries/docs/useDoc';
import { useUserStore } from '@/store/user';

import Header from './header.vue';
import DocMeta from './meta/index.vue';
import EditorHeader from '@/pages/doc/modules/Header.vue';

import { useBlockSystemSave } from '@/hooks/useBlockSystemSave';
import { AppModeEnum } from '@/types/setting';

import '@editor/index.css';
import { storeToRefs } from 'pinia';
import { useContextStore } from '@/store/ui-states/context';

export default defineComponent({
  setup(props) {
    const route = useRoute();

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    // 使用 computed 直接响应路由参数
    const wikiIdRef = computed(() => route.params.wikiId as string);
    const fileIdRef = computed(() => route.params.fileId as string);

    const router = useRouter();

    const { doc } = useDoc(fileIdRef);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    useBlockSystemSave();

    const renderBody = () => {
      if (!doc.value) {
        return (
          <div class="docs-empty">
            <div class="docs-empty_illustration ">
              <DocLoadErrorIllustration />
            </div>
            <div class="docs-empty_text">
              {i18next.t('doc.loadFailed')}
            </div>
          </div>
        );
      }

      const docMetaComponent = {
        setup() {
          return () => h(DocMeta, {
            doc: doc.value,
            user: user.value,
          })
        }
      };

      return (
        <div class="w-full h-full flex flex-col relative">
          <Header id={doc.value?.id} fileId={fileIdRef.value} wikiId={wikiIdRef.value} />
          <div class="flex-1 overflow-hidden">
            <Editor
              key={doc.value?.id}
              doc={doc.value}
              user={user.value}
              docMetaComponent={docMetaComponent} 
              isLocalMode={window.__appMode__ === AppModeEnum.LOCAL}
            >
              {{
                header: () => <EditorHeader file={doc.value} />
              }}
            </Editor>
          </div>
        </div>
      );
    }

    return () => renderBody();
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