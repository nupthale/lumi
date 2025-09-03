<script lang="tsx">
import { defineComponent } from 'vue';
import { TextSelection } from 'prosemirror-state';

import Popover from '../Popover/index.vue';

import { schema } from '../../plugins/schema/index';
import { contextStore } from '../../store/context';
import { PopoverTypeEnum } from '../../interface';
import { hidePopover$ } from '../../event';

import EmojiPanel from '../EmojiPanel/index.vue';

export default defineComponent({
    setup(_props) {
        const handleSelect = (emoji) => {
            const editorView = contextStore.getState().editorView;

            if (!editorView) return;

            const { state, dispatch } = editorView;
            const { selection, tr } = state;
        
            // 将当前selection位置替换为MentionNode
            const { from, to } = selection;
            const emojiNode = schema.nodes.emoji.create({}, [schema.text(emoji.native)]);

            hidePopover$.next({ type: PopoverTypeEnum.EMOJI });
            
            const pos = Math.max(from - 1, 0);
            tr.replaceWith(pos, to, emojiNode);
            tr.setSelection(TextSelection.create(tr.doc, pos + 2));
            dispatch(tr);

            // 重新聚焦编辑器
            editorView.focus();
        }

        return () => (
            <Popover type={PopoverTypeEnum.EMOJI}>
                {{
                    default: () => (
                        <div class="popover">
                            <EmojiPanel onSelect={handleSelect} />
                        </div>
                    )
                }}
            </Popover>
        );
    }
});
</script>

<style scoped>
</style>