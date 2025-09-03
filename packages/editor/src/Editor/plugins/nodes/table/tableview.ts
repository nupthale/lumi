import { Node } from 'prosemirror-model';
import { EditorView, NodeView, ViewMutationRecord } from 'prosemirror-view';
import { CellAttrs } from './util';

import { BaseBlockView } from '../_common/baseBlockView';
import { TopFloatMenuTrigger } from '../_common/topFloatMenuTrigger';
import { TableControl } from './control/table';

/**
 * @public
 */
export class TableView extends BaseBlockView implements NodeView {
  public dom: HTMLDivElement;
  public table: HTMLTableElement;
  public colgroup: HTMLTableColElement;
  public contentDOM: HTMLElement;

  private tableControl: TableControl | null = null;
  private topFloatMenuTrigger: TopFloatMenuTrigger;

  constructor(
    public node: Node,
    public view: EditorView,
    public getPos: () => number | undefined,
    public defaultCellMinWidth: number = 100,
  ) {
    super(node, view, getPos, undefined, true);

    this.dom = document.createElement('div');
    this.dom.classList.add('doc-block', 'doc-table');
    // this.dom.contentEditable = 'false';

    this.tableControl = new TableControl(this);
    const container = this.tableControl.init();

    this.table = this.tableControl.table!;
    this.dom.style.setProperty(
      '--default-cell-min-width',
      `${defaultCellMinWidth}px`,
    );

    this.colgroup = this.tableControl.colgroup!;
    updateColumnsOnResize(node, this.colgroup, this.table, defaultCellMinWidth);

    this.contentDOM = this.tableControl.body!;

    this.dom.appendChild(container);
    
    setTimeout(() => {
      this.tableControl?.update();
    }, 0);

    this.topFloatMenuTrigger = new TopFloatMenuTrigger(this);
  }

  update(node: Node): boolean {
    if (node.type != this.node.type) return false;
    this.node = node;

    updateColumnsOnResize(
      node,
      this.colgroup,
      this.table,
      this.defaultCellMinWidth,
    );
    return true;
  }

  ignoreMutation(record: ViewMutationRecord): boolean {
    const defaultIgnore = super.ignoreMutation(record);

    if (defaultIgnore) {
      return true;
    }

    return (
      record.type == 'attributes' &&
      (record.target == this.table || this.colgroup.contains(record.target))
    );
  }

  destroy(): void {
    super.destroy();

    this.topFloatMenuTrigger.destroy();
    this.tableControl?.destroy();
  }
}

/**
 * @public
 */
export function updateColumnsOnResize(
  node: Node,
  colgroup: HTMLTableColElement,
  table: HTMLTableElement,
  defaultCellMinWidth: number,
  overrideCol?: number,
  overrideValue?: number,
): void {
  let totalWidth = 0;
  let fixedWidth = true;
  let nextDOM = colgroup.firstChild as HTMLElement;
  const row = node.firstChild;
  if (!row) return;

  for (let i = 0, col = 0; i < row.childCount; i++) {
    const { colspan, colwidth } = row.child(i).attrs as CellAttrs;
    for (let j = 0; j < colspan; j++, col++) {
      const hasWidth =
        overrideCol == col ? overrideValue : colwidth && colwidth[j];
      const cssWidth = hasWidth ? hasWidth + 'px' : '';
      totalWidth += hasWidth || defaultCellMinWidth;
      if (!hasWidth) fixedWidth = false;
      if (!nextDOM) {
        const col = document.createElement('col');
        col.style.width = cssWidth;
        colgroup.appendChild(col);
      } else {
        if (nextDOM.style.width != cssWidth) {
          nextDOM.style.width = cssWidth;
        }
        nextDOM = nextDOM.nextSibling as HTMLElement;
      }
    }
  }

  while (nextDOM) {
    const after = nextDOM.nextSibling;
    nextDOM.parentNode?.removeChild(nextDOM);
    nextDOM = after as HTMLElement;
  }

  if (fixedWidth) {
    table.style.width = totalWidth + 'px';
    table.style.minWidth = '';
  } else {
    table.style.width = '';
    table.style.minWidth = totalWidth + 'px';
  }
}
