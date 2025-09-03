<script lang="tsx">
import { defineComponent, PropType, inject } from 'vue';
import { TextButton } from '@zsfe/zsui';
import { ChevronDown } from 'lucide-vue-next';

import ColumnIcon from '@collection/components/ColumnIcon.vue';
import { CollectionSchemaType, ColumnTypeEnum, ColumnType } from '@collection/interface';
import { getColumnTypeText } from '@collection/shared/column';

import { useContextStore } from '@collection/store/index';
import AddColumnDropdown from '@collection/components/AddColumnDropdown/index.vue';
import { useResizeCol } from './useResizeCol';
import { updateColSchema$ } from '@collection/events';

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
    },
    setup(props) {
        const id = inject<string>('id')!;

        const { isResizing, resizeColIndex, handleMousedown } = useResizeCol(props.schema);

        const isNumber = (type: ColumnTypeEnum) => {
            return type === ColumnTypeEnum.NUMBER || type === ColumnTypeEnum.CURRENCY;
        }

        const handleUpdateCol = (column: ColumnType) => {
            updateColSchema$.next({
                id,
                column,
            });
        }

        return () => (
            <div class="hdRow flex items-center flex-nowrap">
                {
                    props.schema?.views.find(view => view.id === props.schema?.viewId)?.columnsConfig
                        .filter(config => !config.hidden)
                        .map((config, index) => {
                            const column = props.schema?.columns?.find(item => item.id === config.id)!;

                            return (
                                <div key={column.id} class="w-full hdCell flex items-center justify-between" style={{ width: `${column.width}px` }}>
                                    {
                                        isNumber(column.type) ? (
                                            <AddColumnDropdown column={column} onConfirm={handleUpdateCol}>
                                                <div class="actions ml-2 flex items-center">
                                                    <TextButton class="zscl-smallButton" size="small">
                                                        <ChevronDown width={14} height={14} />
                                                    </TextButton>
                                                </div>
                                            </AddColumnDropdown>
                                        ) : '' 
                                    }
                                    
                                    <div class="flex-1 flex items-center" style={{ justifyContent: isNumber(column.type) ? 'flex-end' : 'flex-start' }}>
                                        <ColumnIcon type={column.type} size={14} />
                                        <span class="ml-1">{column.title || getColumnTypeText(column.type)}</span>
                                    </div>
                                    

                                    {
                                        !isNumber(column.type) ? (
                                            <AddColumnDropdown column={column} onConfirm={handleUpdateCol}>
                                                <div class="actions ml-2 flex items-center">
                                                    <TextButton class="zscl-smallButton" size="small">
                                                        <ChevronDown width={14} height={14} />
                                                    </TextButton>
                                                </div>
                                            </AddColumnDropdown>
                                        ) : '' 
                                    }

                                    <div class={['resizer', (isResizing.value && resizeColIndex.value === index) ? 'isResizing' : '']} onMousedown={(e) => handleMousedown(e, index)}>
                                        <div class="resizeLine" />
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        );
    }
})
</script>

<style scoped>
.hdRow {
    height: 36px;

    border-top: 1px solid var(--table-border-color);
    border-bottom: 1px solid var(--table-border-color);
}

.hdCell {
    position: relative;
    font-size: 14px;
    padding: 6px 12px 6px 6px;
    cursor: pointer;
    height: 100%;
}

.actions {
    opacity: 0;
}

.hdCell:hover {
    background: var(--table-operation-line);
}

.hdCell:hover .actions {
    opacity: 1;
}

.resizer {
    position: absolute;
    right: 0;
    top: 0;
    width: 6px;
    height: 100%;

    display: flex;
    justify-content: flex-end;

    cursor: ew-resize;
}

.resizer:hover .resizeLine, .resizer.isResizing .resizeLine {
    opacity: 1;
}

.resizeLine {
    opacity: 0;
    width: 2px;
    height: 100%;
    background: #1456f0;
    transition: opacity .2s ease;
}
</style>