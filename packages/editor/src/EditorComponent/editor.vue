<script lang="tsx">
import { defineComponent, onMounted, onUnmounted, ref, Teleport, PropType } from 'vue';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { applyDevTools } from 'prosemirror-dev-toolkit';
import { useMediaQuery } from '@vueuse/core';
import { useSubscription } from '@vueuse/rxjs';
import { filter, tap } from 'rxjs/operators';
import { message } from 'ant-design-vue';

import { plugins } from '@editor/Editor/plugins';
import { schema } from '@editor/Editor/plugins/schema';

import FloatingMenu from '@editor/Editor/components/FloatingMenu/index.vue';
import TopFloatingMenu from '@editor/Editor/components/FloatingMenu/top.vue';
import AutoCompletePopover from '@editor/Editor/components/AutoCompletePopover/index.vue';
import BubbleMenu from '@editor/Editor/components/BubbleMenu/index.vue';
import Catalog from '@editor/Editor/components/Catalog/index.vue';
import Comments from '@editor/Editor/components/Comments/index.vue';
import MentionSelectPopopver from '@editor/Editor/components/MentionSelectPopover/index.vue';
import EmojiSelectPopopver from '@editor/Editor/components/EmojiSelectPopover/index.vue';
import LinkPopover from '@editor/Editor/components/LinkPopover/index.vue';

import { contextStore } from '@editor/Editor/store/context';
import { commentStore } from '@editor/Editor/store/comment';
import { docScroll$, ydocPersistenceSync$, ydocProviderSync$ } from '@editor/Editor/event';
import { useAddEmptyBlock } from '@editor/Editor/hooks/useAddEmptyBlock';
import { useClickEditorOutside } from '@editor/Editor/hooks/useClickEditorOutside';
import { useEditorBlur } from '@editor/Editor/hooks/useEditorBlur';
import { useDocScrollTo } from '@editor/Editor/hooks/useDocScrollTo';  
import { useDragToSelect } from '@editor/Editor/hooks/useDragToSelect';
import { useStopTab } from '@editor/Editor/hooks/useStopTab';
import { initDocumentCollab, removeDocumentCollab } from '@editor/Editor/plugins/collab/index';
import { useHistory } from '@editor/Editor/hooks/useHistory';
import { useExport } from '@editor/Editor/hooks/useExport';

import { loadSharedDoc, cleanupAllCollab } from '@editor/Editor/plugins/collab/core';
import { collectionsWatcher } from '@editor/Editor/plugins/collab/collection';

import { UserType } from '../Editor/interface';

import '@editor/Editor/theme/index.less';

export default defineComponent({
  props: {
    doc: Object,
    docMetaComponent: {
      type: Object,
    },
    collectionComponent: {
      type: Object,
    },
    titleFormatter: {
      type: Function,
    },
    user: Object as PropType<UserType>,
    isLocalMode: Boolean,
  },
  setup(props, { slots }) {
    const editorRef = ref<HTMLElement | null>(null);
    const scrollEl = ref<HTMLElement | null>(null);
    let view: EditorView | null = null;

    const isSmallScreen = useMediaQuery('(max-width: 1600px)');

    const isInit = ref(false);
    const { editorDomRef } = useAddEmptyBlock();
    const { selectionRectRef } = useDragToSelect(editorDomRef);

    useEditorBlur(props.doc?.fileId);
    useClickEditorOutside();
    useDocScrollTo();
    useHistory(props.doc?.fileId, editorRef);
    useStopTab(editorRef);
    useExport(() => view);

    const initEditor = () => {
      if (!editorRef.value || isInit.value) return;
      
      isInit.value = true;

      message.destroy();

      try {
        // 创建初始 EditorState
        const state = EditorState.create({
          schema,
          plugins: plugins(schema, props.doc?.fileId, props.isLocalMode),
        });

        // 创建 EditorView
        // 这里不能覆盖dispatchTransaction， 因为会造成ysync第一次不初始化。如果要监听文档变化，用update 的plugin
        view = new EditorView(editorRef.value, { state });
        contextStore.getState().setEditorView(view);

        if (import.meta.env.MODE !== 'production') {
          applyDevTools(view);
        }
      } catch(e) {
        console.error(e);
      }
    }

    useSubscription(
      ydocPersistenceSync$.pipe(
        filter(({ fileId }) => {
          return Boolean(fileId) && fileId === props.doc?.fileId
        }),
        tap(() => {
          setTimeout(() => {
            initEditor();
          }, 0);
        })
      ).subscribe()
    );

    // 监听远程数据同步完成（可选，用于在线模式）
    useSubscription(
      ydocProviderSync$.pipe(
        filter(({ fileId }) => {
          return Boolean(fileId) && fileId === props.doc?.fileId && !props.isLocalMode
        }),
        tap(() => {
          setTimeout(() => {
              initEditor();
          }, 0);
        })
      ).subscribe()
    );

    onMounted(() => {
      if (!isInit.value) {
        message.loading('连接中...');
      }

      const contextState = contextStore.getState();

      contextState.setDocInfo(props.doc!);
      contextState.setDocMetaComponent(props.docMetaComponent);
      contextState.setScrollEl(scrollEl.value);
      contextState.setTitleFormatter(props.titleFormatter);

      commentStore.getState().setFileId(props.doc?.fileId);

      // local也需要初始化yjs persist
      loadSharedDoc(props.doc?.fileId, props.isLocalMode);

      // 先初始化协同编辑，确保 Yjs 内容加载完成
      initDocumentCollab(props.doc?.fileId, props.user);

      collectionsWatcher.watch(props.doc?.fileId);
    });

    onUnmounted(() => {
      if (view) {
        view.destroy();
        view = null;
      }

      // 清理当前文档的协同编辑
      if (props.doc?.fileId) {
        removeDocumentCollab(props.doc?.fileId);
      }

      cleanupAllCollab();

      collectionsWatcher.unwatch(props.doc?.fileId);
    });

    const handleDocScroll = (e) => {
      docScroll$.next({ e });
    }

    return () => (
      <div class="w-full h-full overflow-auto" id="scrollEl" ref={scrollEl} onScroll={handleDocScroll}>
        {slots.header?.()}
        
        {/* 左侧目录 */}
        <Catalog />

        <div class="relative min-h-[100vh]">
          <div class="flex overflow-hidden">
            <div class="w-[820px] pb-[72px] mx-auto" ref={editorDomRef}>
                <div ref={editorRef} class="prose max-w-none"></div>
            </div>
          </div>

          {/* 右侧评论 */}
          <Comments />

          {/* <LikeSection /> */}
        </div>

        <FloatingMenu />
        <TopFloatingMenu />
        <AutoCompletePopover />

        <BubbleMenu />

        <MentionSelectPopopver />
        <EmojiSelectPopopver />
        <LinkPopover />

        <Teleport to={document.body}>
          <div ref={selectionRectRef} class="fixed"></div>
        </Teleport>
      </div>
    );
  }
});
</script>