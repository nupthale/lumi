import { ref, onUnmounted } from 'vue';
import { createStore } from 'zustand/vanilla';

export const listStore = createStore<{
    orderedListMapInit: boolean;
    orderedListMap: Record<string, number[]>,
    setOrderedListMapInit: (init: boolean) => void,
    setOrderedListMap: (map: Record<string, number[]>) => void, 
}>((set, get) => ({
    orderedListMapInit: false,
    orderedListMap: {},
    setOrderedListMapInit: (init: boolean) => set(() => {
        return {
            orderedListMapInit: init,
        };
    }),
    setOrderedListMap: (map: Record<string, number[]>) => set(() => {
        return {
            orderedListMap: map,
        };
    }),
}))

export function useListStore() {
    const state = ref(listStore.getState());

    const unsubscribe = listStore.subscribe((newState) => {
        state.value = newState;
    });

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        state,
    };
}