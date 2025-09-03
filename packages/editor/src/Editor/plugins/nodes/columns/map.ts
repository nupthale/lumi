// Because working with row and column-spanning cells is not quite
// trivial, this code builds up a descriptive structure for a given
// table node. The structures are cached with the (persistent) table
// nodes as key, so that they only have to be recomputed when the
// content of the table changes.
//
// This does mean that they have to store table-relative, not
// document-relative positions. So code that uses them will typically
// compute the start position of the table and offset positions passed
// to or gotten from this structure by that amount.
import { Node } from 'prosemirror-model';

export type ColumnIndexRange = { startIndex: number, endIndex: number };

let readFromCache: (key: Node) => ColumnsMap | undefined;
let addToCache: (key: Node, value: ColumnsMap) => ColumnsMap;

// Prefer using a weak map to cache table maps. Fall back on a
// fixed-size cache if that's not supported.
if (typeof WeakMap != 'undefined') {
  // eslint-disable-next-line
  let cache = new WeakMap<Node, ColumnsMap>();
  readFromCache = (key) => cache.get(key);
  addToCache = (key, value) => {
    cache.set(key, value);
    return value;
  };
} else {
  const cache: (Node | ColumnsMap)[] = [];
  const cacheSize = 10;
  let cachePos = 0;
  readFromCache = (key) => {
    for (let i = 0; i < cache.length; i += 2)
      if (cache[i] == key) return cache[i + 1] as ColumnsMap;
  };
  addToCache = (key, value) => {
    if (cachePos == cacheSize) cachePos = 0;
    cache[cachePos++] = key;
    return (cache[cachePos++] = value);
  };
}

export class ColumnsMap {
  constructor(
    /**
     * A array with the start position of
     * the column covering that part of the columns in each slot
     */
    public map: number[],
  ) {}

  // Find the dimensions of the cell at the given position.
  findColumnIndex(pos: number): number {
    return this.map.findIndex(i => i === pos);
  }

  // Find the dimensions of the cell at the given position.
  findColumn(pos: number): ColumnIndexRange {
    for (let i = 0; i < this.map.length; i++) {
      const curPos = this.map[i];
      if (curPos != pos) continue;

      const startIndex = i;

      return { startIndex, endIndex: startIndex };
    }
    throw new RangeError(`No columns with offset ${pos} found`);
  }

  // Find the next cell in the given direction, starting from the cell
  // at `pos`, if any.
  nextColumn(pos: number): null | number {
    const index = this.findColumnIndex(pos);

    return this.map[index + 1];
  }

  // Get the rectangle spanning the two given cells.
  rangeBetween(a: number, b: number): ColumnIndexRange {
    return {
      startIndex: this.findColumnIndex(a),
      endIndex: this.findColumnIndex(b),
    };
  }

  columnsInRange(range: ColumnIndexRange): number[] {
    const result: number[] = [];
    const start = Math.min(range.startIndex, range.endIndex);
    const end = Math.max(range.startIndex, range.endIndex);

    for (let i = 0; i < this.map.length; i++) {
        if (i >= start && i <= end) {
            const pos = this.map[i];
            result.push(pos);
        }
    }

    return result;
  }

  // Return the position at which the cell at the given row and column
  // starts, or would start, if a cell started there.
  positionAt(index: number): number {
    return this.map[index];
  }

  // Find the table map for the given table node.
  static get(columns: Node): ColumnsMap {
    return readFromCache(columns) || addToCache(columns, computeMap(columns));
  }
}

function computeMap(columns: Node): ColumnsMap {
  if (columns.type.name != 'columns')
    throw new RangeError('Not a columns node: ' + columns.type.name);

  let offset = 1;
  const map: number[] = [];
  columns.children.forEach((col, index) => {
    map[index] = offset;
    offset += col.nodeSize;
  });

  return new ColumnsMap(map);
}