<script lang="tsx">
import { defineComponent } from 'vue';
import { toggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';
import { CodeXml } from 'lucide';
import { Tooltip } from 'ant-design-vue';
import { i18next } from '@editor/i18n';

import { schema } from '../../plugins/schema';
import LucideIcon from '../LucideIcon/index.vue';

import { contextStore } from '../../store/context';

export default defineComponent({
    props: {
        active: Boolean,
        iconSize: {
            type: Number,
            default: 18,
        },
    },
    setup(props) {
        const handleAction = (markType: MarkType) => {
            const editorView = contextStore.getState().editorView;
            if (!editorView) return;

            const { state, dispatch } = editorView;

            toggleMark(markType)(state, dispatch);

            editorView.focus();
        }

        return () => (
            <div class={[props.active ? 'active' : '']} onClick={() => handleAction(schema.marks.code)}>
                <Tooltip title={i18next.t('editor.commands.code')}>
                    <LucideIcon icon={CodeXml} width={props.iconSize}></LucideIcon>
                </Tooltip>
            </div>
        );
    },
})
</script>