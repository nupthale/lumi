<script lang="tsx">
import { defineComponent, PropType, computed, toRef } from 'vue';

import { useContextStore } from '@collection/store/index';
import Drawer from '@collection/components/Drawer/index.vue';
import { CollectionSchemaType } from '@collection/interface';
import { useCard } from '@collection/hooks/useCard';

import DetailForm from './form/index.vue';

export default defineComponent({
    props: {
        id: String,
        schema: Object as PropType<CollectionSchemaType>,
    },
    setup(props) {
        const { activeRow } = useContextStore();

        const { titleColumnId } = useCard(toRef(props, 'schema'));

        const title = computed(() => {
            const titleColumn = props.schema?.columns?.find(item => item.id === titleColumnId.value);

            if (!titleColumn) return '-'
            return activeRow.value?.[titleColumn.id];
        });

        const renderBody = () => {
            if (activeRow.value) {
                return (
                    <div class="body">
                        <DetailForm
                            id={props.id}
                            schema={props.schema}
                            value={activeRow.value}
                        />
                    </div>
                );
            }

            return '';
        }

        return () => (
            <Drawer open={!!activeRow.value} title={title.value} width={480} onClose={() => activeRow.value = null}>
                {{
                    body: renderBody,
                }}
            </Drawer>
        )
    }
})
</script>


<style scoped>
.body {
    padding: 0 24px;
}
</style>