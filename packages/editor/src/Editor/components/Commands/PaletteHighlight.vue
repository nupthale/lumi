<script lang="tsx">
import { defineComponent, ref, toRef } from 'vue';
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
        const { updateHighlightTextColor, updateHighlightBackgroundColor, updateHighlightBorderColor } = useHighlight(toRef(props, 'crtNodeView'));

        return () => (
            <div>
                <AntdPopover trigger="hover" placement="top">
                    {{
                        default: () => (
                            <div class="flex items-center" onClick={stopEvent}>
                                <Tooltip title={i18next.t('editor.commands.color')}>
                                    <LucideIcon icon={Palette} width={props.iconSize}></LucideIcon>
                                </Tooltip>
                                {props.showText ? (
                                    <span class="text-xs ml-1.5">{i18next.t('editor.commands.color')}</span>
                                ) : ''}
                            </div>
                        ),
                        content: () => (
                            <ColorPalette
                                borderColorEnable
                                onColor={(color) => updateHighlightTextColor(color)}
                                onBorder={(color) => updateHighlightBorderColor(color)}
                                onBackground={(color) => updateHighlightBackgroundColor(color)}
                            />
                        )
                    }}
                </AntdPopover>
            </div>
        );
    },
})
</script>