<script lang="tsx">
import { defineComponent, PropType, toRef } from 'vue';

import { BaseBlockView } from '../../../plugins/nodes/_common/baseBlockView';

import { useAddBlock } from '../useAddBlock';
import { contextStore } from '@editor/Editor/store/context';
import { blockMouseLeave$, hidePopover$ } from '@editor/Editor/event';
import { PopoverTypeEnum } from '@editor/Editor/interface';

import { useIsDeepBlock } from './useIsDeepBlock';
import Menus from './Menus.vue';

export default defineComponent({
    props: {
        nodeView: {
            type: Object as PropType<BaseBlockView | null>
        }
    },
    setup(props) {
        const nodeViewRef = toRef(props, 'nodeView');

        const { addBlock } = useAddBlock();

        const { isDeepBlock } = useIsDeepBlock(nodeViewRef);

        const handleSelectType = (type: string, attrs?: any) => {
            const editorView = contextStore.getState().editorView;

            if (!editorView) {
                return;
            }

            const { schema } = editorView.state;

            if (!schema.nodes[type]) return;

            addBlock(nodeViewRef.value?.getPos(), schema, schema.nodes[type], attrs);

            blockMouseLeave$.next({
                delay: 0,
            });

            hidePopover$.next({
                type: PopoverTypeEnum.AUTO_COMPLETE,
            });

            editorView.focus();
        };

        return () => (
            <Menus isDeepBlock={isDeepBlock.value} onSelect={handleSelectType} />
        );
    }
});
</script>

<style scoped>
</style>