<script lang="tsx">
import { defineComponent, PropType, inject, ref } from 'vue';
import { isNil, isEmpty } from 'lodash-es';

import { CollectionSchemaType, OperatorEnum } from '@collection/interface';

import { useContextStore } from '@collection/store/index';
import { cellValueUpdate$, activeCell$ } from '@collection/events';
import { getCellId, compareValues } from '@collection/shared/cell';
import RowDropdown from '@collection/views/common/modules/rowDropdown/index.vue';

import { useSort } from '@collection/hooks/useSort';
import { useFilter } from '@collection/hooks/useFilter';

import Field from '@collection/components/Field/index.vue';

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        values: Array as PropType<Record<string, any>[]>,
        groupKey: String,
    },
    setup(props) {
        const id = inject<string>('id')!;

        const { activeCell } = useContextStore();

        const { sort } = useSort(props.schema);
        const { filter } = useFilter(props.schema);

        const handleCellClick = (e: MouseEvent, rowId: string, columnId: string) => {
            e.stopPropagation();

            activeCell$.next({
                id,
                groupKey: props.groupKey,
                rowId,
                columnId,
            });
        }

        const isActiveCell = (rowId: string, columnId: string) => {
            if (activeCell.value) {
                return (
                    activeCell.value.id === id && 
                    activeCell.value.rowId === rowId && 
                    activeCell.value.columnId === columnId &&
                    activeCell.value.groupKey === props.groupKey
                );
            }

            return false;
        }

        return () => (props.values || [])
            .filter(filter)
            .sort(sort)
            .map((value, index) => (
                <RowDropdown id={id} row={value}>
                    <div key={value.id} class="row flex items-center flex-nowrap" data-id={value.id} data-group={props.groupKey}>
                        <div class="relative ">
                            <div class="indexCell text-xs text-right">
                                {index + 1}
                            </div>
                        </div>
                        {
                            props.schema?.views.find(view => view.id === props.schema?.viewId)?.columnsConfig
                                .filter(config => !config.hidden)
                                .map((config) => {
                                    const column = props.schema?.columns.find((col) => col.id === config.id)!;

                                    return (
                                        <div 
                                            id={getCellId(id, value.id, column.id, props.groupKey)}
                                            key={column.id} 
                                            class="cell flex items-start justify-between" 
                                            style={{ width: `${column.width}px` }}
                                            onClick={(e) => handleCellClick(e, value.id, column.id)}
                                        >
                                            <Field 
                                                isEditing={isActiveCell(value.id, column.id)}
                                                rowId={value.id}
                                                value={value[column.id]} 
                                                column={column} 
                                                onChange={(newVal) => cellValueUpdate$.next({ id, rowId: value.id, columnId: column.id, value: newVal })} 
                                            />
                                        </div>
                                    )
                                })
                        }
                    </div>
                </RowDropdown>
            ));
    }
})
</script>

<style scoped>
.row {
    min-height: 36px;
    border-bottom: 1px solid var(--table-border-color);
}

.row:hover {
    background: var(--table-operation-line);
}

.cell {
    font-size: 14px;
    padding: 6px 12px 6px 6px;
    align-self: stretch; /** 高度与row高度一致 */
    
}

.indexCell {
    position: absolute;
    left: -32px;
    top: -8px;
    width: 24px;
    color: #8F959E;
}
</style>