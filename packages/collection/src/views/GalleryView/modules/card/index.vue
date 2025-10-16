<script lang="tsx">
import { defineComponent, PropType, toRef, inject, computed, ref } from 'vue';
import { isNil } from 'lodash-es';

import { useContextStore } from '@collection/store/index';
import { useCard } from '@collection/hooks/useCard';

import { CollectionSchemaType, ColumnType, ColumnTypeEnum } from '@collection/interface';
import RowDropdown from '@collection/views/common/modules/rowDropdown/index.vue';

import FieldValue from '@collection/components/FieldValue/index.vue';

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        row: Object as PropType<Record<string, any>>,
    },
    setup(props) {
        const id = inject<string>('id')!;
        
        const { titleColumnId, coverColumnId, tagColumn } = useCard(toRef(props, 'schema'));

        const { contextStore } = useContextStore();

        const descColumnsRef = computed(() => {
            const excludeColumnIds = [titleColumnId.value, coverColumnId.value, tagColumn.value?.id];

            if (!props.schema) return [];

            return props.schema.columns.filter((column) => !excludeColumnIds.includes(column.id));
        });

        const handleCardClick = () => {
            contextStore.getState().setActiveCollectionId(id);
            contextStore.getState().setActiveRow(props.row!);
        }

        return () => (
            <RowDropdown id={id} row={props.row}>
                <div class="card" onClick={handleCardClick}>
                    <div class="cover" style={{ backgroundImage: `url(${props.row?.[coverColumnId.value!]?.[0]?.url})`}}></div>
                    <div class="title">{props.row?.[titleColumnId.value!]}</div>
                    {
                        tagColumn.value ? (
                            <div class="tag">
                                <FieldValue value={props.row?.[tagColumn.value?.id!]} column={tagColumn.value} />
                            </div>
                        ) : ''
                    }
                    <div class="desc flex-1 overflow-hidden mt-3">
                        {
                            descColumnsRef.value.map((column) => {
                                return !isNil(props.row?.[column.id]) ? (
                                    <div class="desc-item mb-1" key={column.id}>
                                        <FieldValue value={props.row[column.id]} column={column} />
                                    </div>
                                ) : ''
                            })
                        }
                    </div>
                </div>
            </RowDropdown>
        );
    }
})
</script>

<style scoped>
.card {
    position: relative;
    width: 240px;
    height: 336px;

    display: flex;
    flex-direction: column;

    border-radius: 8px;
    transition: all .1s ease;
    cursor: pointer;
    padding: 14px 14px 0;

    user-select: none;
    border: 1px solid var(--default-border-color);
}

.card:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: var(--template-card-bg-after);
}

.card .text-right {
    text-align: left;
}

.card:hover {
    border-color: transparent;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 4px 16px -2px, rgba(0, 0, 0, 0.04) 0px 2px 8px 0px, rgba(31, 34, 37, 0.09) 0px 0px 0px 1px;
}

.cover {
    flex-shrink: 0;
    width: 100%;
    height: 120px;
    background-color: var(--image-active-bg);
    background-size: cover;
    border-radius: 6px;
}

.title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-top: 24px;
    letter-spacing: normal;

    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
}

.tag {
    margin-top: 8px;
}

.tag :deep(.selectTag) {
    padding: 0 4px;
    border-radius: 4px;
}

.desc {
    font-size: 12px;
    line-height: 18px;
    margin: 12px 0;
    word-break: break-word;
}
</style>