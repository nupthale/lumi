<script lang="tsx">
import { defineComponent, PropType, toRef, inject, watch, ref } from 'vue';
import { Tooltip, Dropdown } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { Plus } from 'lucide-vue-next';
import { useElementSize } from '@vueuse/core'

import { i18next } from '@collection/i18next';

import { themeTokens } from '@collection/shared/theme';
import { CollectionSchemaType, ColumnType } from '@collection/interface';

import ScrollView from '@collection/components/ScrollView.vue';

import AddColumnDropdown from '@collection/components/AddColumnDropdown/index.vue';
import Header from './modules/header/index.vue';
import Body from './modules/body/index.vue';
import Selection from './modules/selection/index.vue';

import { useSchema } from './hooks/useSchema';

import { addCol$, addRow$, collectionSizeUpdate$ } from '@collection/events';

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        values: Array as PropType<Record<string, any>[]>,
    },
    setup(props) {
        const schemaRef = toRef(props, 'schema');

        const { gridWidth } = useSchema(schemaRef)

        const id = inject<string>('id')!;

        const wrapRef = ref();
        const { width: wrapWidth, height: wrapHeight } = useElementSize(wrapRef);

        watch([wrapWidth, wrapHeight], (val) => {
            if (val[0] && val[1]) {
                collectionSizeUpdate$.next({ id });
            }
        }, {
            immediate: false,
        });

        const handleAddRow = () => {
            addRow$.next({
                id,
                direction: 'below',
                count: 1,
            });
        };

        const handleAddCol = (column: ColumnType) => {
            addCol$.next({
                id,
                direction: 'right',
                column,
            })
        }

        return () => (
            <div class="container">
                <ScrollView contentClass="relative">
                    <div style={{ width: `${gridWidth.value}px` }} ref={wrapRef}>
                        <Header schema={props.schema} />
                        <Body schema={props.schema} values={props.values} />

                        <Selection />

                        <div class="rightActions">
                            <AddColumnDropdown onConfirm={handleAddCol}>
                                <Tooltip title={i18next.t('collection.addColumn')} placement='right'>
                                    <TextButton class="addRowBtn">
                                        <div class="flex items-center gap-1">
                                            <Plus width="16px" height="16px" color={themeTokens.lightTextColor()} />
                                        </div>
                                    </TextButton>
                                </Tooltip>
                            </AddColumnDropdown>
                        </div>
                    </div>
                    <div>
                        <div class="footer">
                            <TextButton class="addRowBtn" onClick={handleAddRow}>
                                <div class="flex items-center gap-1">
                                    <Plus width="16px" height="16px" color={themeTokens.lightTextColor()} />
                                    <span class="addRowBtnText">{i18next.t('collection.addRow')}</span>
                                </div>
                            </TextButton>
                        </div>

                       
                    </div>
                </ScrollView>
            </div>
        );
    }
})
</script>

<style scoped>
.container {
}

.footer {
    display: flex;
    align-items: center;
    height: 36px;
    line-height: 36px;
}

.addRowBtnText {
    opacity: 0;
    transition: opacity .1s linear;
}

.addRowBtn:hover .addRowBtnText {
    opacity: 1;
}

.rightActions {
    display: flex;
    justify-content: center;

    width: 36px;
    position: absolute;
    right: -36px;
    top: 6px;
}
</style>