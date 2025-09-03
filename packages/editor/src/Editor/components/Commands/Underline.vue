<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { toggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';
import { tap, filter } from 'rxjs/operators';
import { useSubscription } from '@vueuse/rxjs';
import { Bold, Italic, Strikethrough, Underline, Palette, MessageSquareText, Trash2, TableCellsMerge } from 'lucide';
import { Tooltip, Popover as AntdPopover } from 'ant-design-vue';
import { i18next } from '@editor/i18n';

import Popover from '../Popover/index.vue';
import { schema } from '../../plugins/schema';
import LucideIcon from '../LucideIcon/index.vue';

import { contextStore } from '../../store/context';
import { showPopover$ } from '../../event';
import { stopEvent } from '../../shared/event';
import { PopoverTypeEnum, CommandEnum } from '../../interface';

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
            <div class={[props.active ? 'active' : '']} onClick={() => handleAction(schema.marks.underline)}>
                <Tooltip title={i18next.t('editor.commands.underline')}>
                    <LucideIcon icon={Underline} width={props.iconSize}></LucideIcon>
                </Tooltip>
            </div>
        );
    },
})
</script>