import { ref, onUnmounted, computed } from 'vue';
import { EditorView } from 'prosemirror-view';
import { createStore } from 'zustand/vanilla';

import { PopoverTypeEnum } from '../interface';

export const contextStore = createStore<{
    docInfo: Record<string, any> | null,
    editorView: EditorView | null,
    scrollEl: HTMLElement | null,
    popovers: Record<PopoverTypeEnum, boolean>,
    hasPopoverVisible: boolean,
    docMetaComponent: any,
    titleFormatter?: Function,
    setTitleFormatter: (formatter?: Function) => void,
    setDocInfo: (docInfo: Record<string, any>) => void,
    setEditorView: (view: EditorView) => void,
    setScrollEl: (el: HTMLElement | null) => void,
    setPopoverVisible: (type: PopoverTypeEnum, visible: boolean) => void,
    setDocMetaComponent: (component: any) => void,
}>((set, get) => ({
    docInfo: null,
    editorView: null,
    scrollEl: null,
    docMetaComponent: null,
    titleFormatter: undefined,
    popovers: {
        [PopoverTypeEnum.MENTION]: false,
        [PopoverTypeEnum.BUBBLE_MENU]: false,
        [PopoverTypeEnum.FLOAT_MENU]: false,
        [PopoverTypeEnum.EMOJI]: false,
        [PopoverTypeEnum.LINK]: false,
        [PopoverTypeEnum.AUTO_COMPLETE]: false,
    },
    get hasPopoverVisible() {
        return Object.values(get().popovers).some(visible => visible);
    },
    
    setTitleFormatter: (formatter?: Function) => set({ titleFormatter: formatter }),
    setDocInfo: (docInfo: Record<string, any>) => set({ docInfo }),
    setEditorView: (view: EditorView | null) => set({ editorView: view }),
    setScrollEl: (el: HTMLElement | null) => set({ scrollEl: el }),
    setPopoverVisible: (type: PopoverTypeEnum, visible: boolean) => set((state) => ({
        popovers: {
            ...state.popovers,
            [type]: visible,
        }
    })),
    setDocMetaComponent: (component: any) => set({ docMetaComponent: component }),
}))

export function useContextStore() {
    const state = ref(contextStore.getState());

    const unsubscribe = contextStore.subscribe((newState) => {
        state.value = newState;
    });

    const docInfo = computed(() => state.value.docInfo);

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        state,
        docInfo,
        setEditorView: contextStore.getState().setEditorView,
        setPopoverVisible: contextStore.getState().setPopoverVisible,
        setDocMetaComponent: contextStore.getState().setDocMetaComponent,
        getDocMetaComponent: () => contextStore.getState().docMetaComponent,
        setTitleFormatter: contextStore.getState().setTitleFormatter,
        titleFormatter: contextStore.getState().titleFormatter,
    };
}