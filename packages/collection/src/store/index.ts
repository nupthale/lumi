import { ref, onMounted, onUnmounted } from 'vue';
import { createStore } from 'zustand/vanilla';

type ActiveCellType = {
    id: string;
    rowId: string;
    columnId: string;
    groupKey?: string;
}

export const contextStore = createStore<{
    activeCell: ActiveCellType | null,
    setActiveCell: (cell: ActiveCellType | null) => void,

    activeRow: Record<string, any> | null,
    setActiveRow: (row: Record<string, any> | null) => void,
}>((set) => ({
    activeCell: null,
    setActiveCell: (cell: ActiveCellType | null) => {
        set({ activeCell: cell });
    },

    activeRow: null,
    setActiveRow: (row: Record<string, any> | null) => {
        set({ activeRow: row });
    },
}));

export function useContextStore() {
    const activeCell = ref<ActiveCellType | null>(null);

    const activeRow = ref<Record<string, any> | null>(null);

    const unsubscribeRef = ref();

    onMounted(() => {
        unsubscribeRef.value = contextStore.subscribe((newState, prevState) => {
            activeCell.value = newState.activeCell;

            activeRow.value = newState.activeRow;
        });
    });

    onUnmounted(() => {
        if (unsubscribeRef.value) {
            unsubscribeRef.value();
        }
    });

    return {
        contextStore,
        activeCell,
        activeRow,
    };
}