import { Ref } from 'vue';
import { CommandEnum } from "@editor/Editor/interface";

import Strong from './Strong.vue';
import StrikeThrough from './StrikeThrough.vue';
import Italic from './Italic.vue';
import Code from './Code.vue';
import Underline from './Underline.vue';
import Link from './Link.vue';
import Palette from './Palette.vue';
import PaletteHighlight from './PaletteHighlight.vue';
import HighlightSmall from './HighlightSmall.vue';
import MergeCell from './MergeCell.vue';
import TableCellColor from './TableCellColor.vue';
import ColumnsDelete from './ColumnsDelete.vue';
import ColumnsBgColor from './ColumnsBgColor.vue';
import TableDeleteCol from './TableDeleteCol.vue';
import TableDeleteRow from './TableDeleteRow.vue';
import Comment from './Comment.vue';
import { NodeView } from 'prosemirror-view';

export const renderCommand = ({
    command, 
    paramsRef, 
    marksRef,
    iconSize,
    crtNodeViewRef,
    showText = false,
}: {
    command: CommandEnum, 
    paramsRef: Ref<Record<string, any>>, 
    marksRef?: Ref<any>,
    iconSize?: number,
    crtNodeViewRef?: Ref<NodeView>,
    showText?: boolean,
}) => {

    switch(command) {
        case CommandEnum.STRONG:
            return (<Strong iconSize={iconSize} class="menuItem" active={marksRef?.value?.includes('strong')} />);
        
        case CommandEnum.STRIKE:
            return (<StrikeThrough iconSize={iconSize} class="menuItem" active={marksRef?.value?.includes('strikethrough')} />);

        case CommandEnum.ITALIC:
            return (<Italic iconSize={iconSize} class="menuItem" active={marksRef?.value?.includes('italic')} />);    

        case CommandEnum.UNDERLINE:
            return (<Underline iconSize={iconSize} class="menuItem" active={marksRef?.value?.includes('underline')} />);

        case CommandEnum.CODE:
            return (<Code iconSize={iconSize} class="menuItem" active={marksRef?.value?.includes('code')} />);

        case CommandEnum.LINK:
            return (<Link iconSize={iconSize} class="menuItem" active={marksRef?.value?.includes('link')} />);

        case CommandEnum.PALETTE:
            return (<Palette iconSize={iconSize} class="menuItem" />);

        case CommandEnum.HIGHLIGHT_PALETTE:
            return (<PaletteHighlight showText={showText} iconSize={iconSize} class={['menuItem']} crtNodeView={crtNodeViewRef?.value} />);

        case CommandEnum.HIGHLIGHT_SMALL:
            return (<HighlightSmall showText={showText} iconSize={iconSize} class={['menuItem']} crtNodeView={crtNodeViewRef?.value} />);

        case CommandEnum.TABLE_MERGECELL:
            return (<MergeCell iconSize={iconSize} class={['menuItem']} />);
        
        case CommandEnum.TABLE_CELLBGCOLOR:
            return (
                <TableCellColor 
                    iconSize={iconSize} 
                    class={['menuItem']}
                    palette={paramsRef?.value?.palette}
                />
            );

        case CommandEnum.COLUMNS_DELETECOL:
            return (<ColumnsDelete iconSize={iconSize} class={['menuItem']} />);    

        case CommandEnum.COLUMNS_COLUMNBGCOLOR:
            return (<ColumnsBgColor iconSize={iconSize} class={['menuItem']} palette={paramsRef?.value?.palette} />);    

        case CommandEnum.TABLE_DELETECOL:
            return (<TableDeleteCol iconSize={iconSize} class={['menuItem']} />);

        case CommandEnum.TABLE_DELETEROW:
            return (<TableDeleteRow iconSize={iconSize} class={['menuItem']} />);    

        case CommandEnum.COMMENT:
            return (<Comment iconSize={iconSize} class={['menuItem']} />);

        default:
            return '';
    }
}