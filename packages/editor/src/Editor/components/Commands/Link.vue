<script lang="tsx">
import { defineComponent } from 'vue';
import { Link } from 'lucide';
import { Tooltip } from 'ant-design-vue';
import { i18next } from '@editor/i18n';

import LucideIcon from '../LucideIcon/index.vue';
import { contextStore } from '../../store/context';

import { schema } from '../../plugins/schema/index';
import { showPopover$ } from '../../event';
import { PopoverTypeEnum } from '../../interface';

export default defineComponent({
    props: {
        active: Boolean,
        iconSize: {
            type: Number,
            default: 18,
        },
    },
    setup(props) {
        const handleAction = (e) => {
            e.stopPropagation();

            const editorView = contextStore.getState().editorView;
            if (!editorView) return;

            const { state } = editorView;
            const { selection } = state;
            const { from, to } = selection;

            if (from === to) {
                return;
            }

            const mockSelection = schema.marks.mockSelection.create({});    
            // 添加一个mock的selection， 防止input focus的时候， 下面的selection看不到
            const tr = state.tr;
            tr.setMeta('addToHistory', false);
            tr.addMark(from, to, mockSelection);
            editorView.dispatch(tr);

            showPopover$.next({
                type: PopoverTypeEnum.LINK,
                range: [from, to],
            });
        }

        return () => (
            <div class={[props.active ? 'active' : '']} onClick={(e) => handleAction(e)}>
                <Tooltip title={i18next.t('editor.commands.link')}>
                    <LucideIcon icon={Link} width={props.iconSize}></LucideIcon>
                </Tooltip>
            </div>
        );
    },
})
</script>