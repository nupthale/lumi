import { CommandEnum } from "../interface";

export const defaultCommands = [
    CommandEnum.STRONG,
    CommandEnum.ITALIC,
    CommandEnum.STRIKE,
    CommandEnum.UNDERLINE,
    CommandEnum.LINK,
    CommandEnum.PALETTE,
    CommandEnum.CODE,
    CommandEnum.EMOJI,
    CommandEnum.COMMENT,
];

export const tableRowCommands = [
    CommandEnum.TABLE_MERGECELL,
    CommandEnum.TABLE_CELLBGCOLOR,
    CommandEnum.TABLE_DELETEROW,
];

export const tableColCommands = [
    CommandEnum.TABLE_MERGECELL,
    CommandEnum.TABLE_CELLBGCOLOR,
    CommandEnum.TABLE_DELETECOL,
];

export const tableCellCommands = [
    CommandEnum.TABLE_MERGECELL,
    CommandEnum.TABLE_CELLBGCOLOR,
];

export const columnsColCommands = [
    CommandEnum.COLUMNS_COLUMNBGCOLOR,
    CommandEnum.COLUMNS_DELETECOL,
];

export const hightlightCommands = [
    CommandEnum.HIGHLIGHT_PALETTE,
];
