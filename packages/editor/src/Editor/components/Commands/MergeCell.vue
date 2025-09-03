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
import ColorPalette from '../ColorPalette/index.vue';

import { contextStore } from '../../store/context';
import { showPopover$ } from '../../event';
import { stopEvent } from '../../shared/event';
import { PopoverTypeEnum, CommandEnum } from '../../interface';

import { useTable } from './hooks/useTable';

export default defineComponent({
    props: {
        active: Boolean,
        iconSize: {
            type: Number,
            default: 18,
        },
    },
    setup(props) {
        const { 
            handleDeleteRows,
            handleDeleteCols,
            handleMergeSelectedCells,
        } = useTable();

        return () => (
            <div onClick={() => handleMergeSelectedCells()}>
                <Tooltip title={i18next.t('editor.commands.mergeCells')}>
                    <LucideIcon icon={TableCellsMerge} width={props.iconSize}></LucideIcon>
                </Tooltip>
            </div>
        );
    },
})
</script>