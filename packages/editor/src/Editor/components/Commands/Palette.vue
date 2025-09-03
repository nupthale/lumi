<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { toggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';
import { tap, filter } from 'rxjs/operators';
import { useSubscription } from '@vueuse/rxjs';
import { Bold, Italic, Strikethrough, Underline, Palette, MessageSquareText, Trash2, TableCellsMerge } from 'lucide';
import { Tooltip, Popover as AntdPopover } from 'ant-design-vue';

import Popover from '../Popover/index.vue';
import { schema } from '../../plugins/schema';
import LucideIcon from '../LucideIcon/index.vue';
import ColorPalette from '../ColorPalette/index.vue';

import { contextStore } from '../../store/context';
import { showPopover$ } from '../../event';
import { stopEvent } from '../../shared/event';
import { PopoverTypeEnum, CommandEnum } from '../../interface';

import { useColor } from './hooks/useColor';

export default defineComponent({
    props: {
        active: Boolean,
        iconSize: {
            type: Number,
            default: 18,
        },
    },
    setup(props) {
        const { updateTextColor, updateBackgroundColor } = useColor();

        return () => (
             <div>
                <AntdPopover trigger="hover" >
                    {{
                        default: () => (
                            <div onClick={stopEvent}>
                                <LucideIcon icon={Palette} width={props.iconSize}></LucideIcon>
                            </div>
                        ),
                        content: () => (
                            <ColorPalette
                                onColor={(color) => updateTextColor(color)}
                                onBackground={(color) => updateBackgroundColor(color)}
                            />
                        )
                    }}
                </AntdPopover>
            </div>
        );
    },
})
</script>