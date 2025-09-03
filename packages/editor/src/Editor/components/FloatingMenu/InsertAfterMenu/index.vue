<script lang="tsx">
import { defineComponent, PropType, toRef, computed } from 'vue';
import { Popover as AntdPopover } from 'ant-design-vue';

import { BaseBlockView } from '../../../plugins/nodes/_common/baseBlockView';

import { useAddBlock } from '../useAddBlock';
import { contextStore } from '@editor/Editor/store/context';
import { blockMouseLeave$, blockMouseLeaveTop$ } from '@editor/Editor/event';

import Menus from '../EmptyMenu/Menus.vue';
import { useIsDeepBlock } from '../EmptyMenu/useIsDeepBlock';

export default defineComponent({
    props: {
        nodeView: {
            type: Object as PropType<BaseBlockView | null>
        }
    },
    setup(props, { slots }) {
        const nodeViewRef = toRef(props, 'nodeView');

        const { isDeepBlock } = useIsDeepBlock(nodeViewRef);

        const { insertAfter } = useAddBlock();

        const handleSelectType = (type: string, attrs?: any) => {
            const editorView = contextStore.getState().editorView;

            if (!editorView) {
                return;
            }

            const { schema } = editorView.state;

            if (!schema.nodes[type]) return;

            insertAfter(nodeViewRef.value?.getPos(), schema, schema.nodes[type], attrs);

            blockMouseLeave$.next({
                delay: 0,
            });

            blockMouseLeaveTop$.next({
                delay: 0,
            });

            editorView.focus();
        };

        return () => (
            <AntdPopover placement="right">
                {{
                    default: slots.default?.(),
                    content: () => (
                        <Menus isDeepBlock={isDeepBlock.value} onSelect={handleSelectType} />
                    )
                }}
            </AntdPopover>
        );
    }
});
</script>

<style scoped>
</style>