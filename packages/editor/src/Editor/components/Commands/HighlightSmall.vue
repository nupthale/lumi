<script lang="tsx">
import { defineComponent, ref, toRef, computed, watchEffect } from 'vue';
import { toggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';
import { tap, filter } from 'rxjs/operators';
import { useSubscription } from '@vueuse/rxjs';
import { Bold, Italic, Strikethrough, Underline, Palette, MessageSquareText, Trash2, TableCellsMerge, Minimize, Maximize } from 'lucide';
import { Tooltip, Popover as AntdPopover } from 'ant-design-vue';
import { i18next } from '@editor/i18n';

import Popover from '../Popover/index.vue';
import { schema } from '../../plugins/schema';
import LucideIcon from '../LucideIcon/index.vue';
import ColorPalette from '../ColorPalette/index.vue';

import { contextStore } from '../../store/context';
import { showPopover$ } from '../../event';
import { stopEvent } from '../../shared/event';
import { PopoverTypeEnum, CommandEnum } from '../../interface';

import { useHighlight } from './hooks/useHighlight';

export default defineComponent({
    props: {
        active: Boolean,
        iconSize: {
            type: Number,
            default: 18,
        },
        crtNodeView: Object,
        showText: Boolean,
    },
    setup(props) {
        const nodeViewRef = toRef(props, 'crtNodeView');

        const { updateHighlightSize } = useHighlight(nodeViewRef);

        const isSmall = ref(nodeViewRef.value?.node?.attrs?.small);

        watchEffect(() => {
            isSmall.value = nodeViewRef.value?.node?.attrs?.small;
        });

        const handleToggle = () => {
            updateHighlightSize(!isSmall.value);
        
            isSmall.value = !isSmall.value;
        };

        return () => (
            <div class={[props.active ? 'active' : '', 'flex', 'items-center']} onClick={handleToggle}>
                <Tooltip title={!isSmall.value ? i18next.t('editor.commands.highlightSmall') : i18next.t('editor.commands.highlightLarge')}>
                    <LucideIcon icon={isSmall.value ? Maximize : Minimize} width={props.iconSize}></LucideIcon>
                </Tooltip>
                {props.showText ? (
                    <span class="text-xs ml-1.5">{!isSmall.value ? i18next.t('editor.commands.highlightSmall') : i18next.t('editor.commands.highlightLarge')}</span>
                ) : ''}
            </div>
        );
    },
})
</script>