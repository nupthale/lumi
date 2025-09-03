<script lang="tsx">
import { defineComponent, PropType, computed } from 'vue';

import ColumnIcon from '@collection/components/ColumnIcon.vue';
import { CollectionSchemaType } from '@collection/interface';
import Field from '@collection/components/Field/index.vue';

import { cellValueUpdate$ } from '@collection/events';
import { getColumnTypeText } from '@collection/shared/column';

export default defineComponent({
    props: {
        id: String,
        schema: Object as PropType<CollectionSchemaType>,
        value: Object as PropType<Record<string, any>>,
    },
    setup(props) {
        const columns = computed(() => {
            if (!props.schema) {
                return [];
            }

            const view = props.schema.views.find(view => view.id === props.schema?.viewId);
            const columnConfig = view?.columnsConfig || [];
            const hiddenColumnIds = columnConfig.filter((item) => item.hidden).map((item) => item.id);

            return props.schema.columns.filter((column) => !hiddenColumnIds.includes(column.id));
        });

        return () => (
            <div>
                {
                    columns.value?.map((column) => (
                        <div class="fieldItem flex flex-col gap-1 items-start" key={column.id}>
                            <div class="fieldTitle flex items-center gap-1 lightText">
                                <ColumnIcon type={column.type} />
                                {column.title || getColumnTypeText(column.type)}
                            </div>
                            <div class="fieldValue">
                                <Field 
                                    showPlaceholder
                                    autofocus={false}
                                    isEditing={true}
                                    rowId={props.value?.id}
                                    value={props.value?.[column.id]} 
                                    column={column} 
                                    onChange={(newVal) => cellValueUpdate$.next({ id: props.id!, rowId: props.value?.id!, columnId: column.id, value: newVal })} 
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
})
</script>


<style scoped>
.fieldItem {
    margin-bottom: 26px;
    font-size: 14px;
}

.fieldItem .text-right {
    text-align: left;
}

.fieldItem :deep(.imageThumb) {
    width: 120px;
    height: 80px;
}

.fieldTitle {
    margin-bottom: 8px;
}

.fieldValue {
    width: 100%;
    flex: 1;
    min-height: 20px;
}
</style>