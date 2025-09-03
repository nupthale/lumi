// cell的坐标
export const getCellId = (id: string, rowId: string, columnId: string, groupKey?: string) => {
    return `${id}_${groupKey || ''}_${rowId}_${columnId}`;
}

// 用于values的sort函数
export function compareValues(aValue: any, bValue: any, order: 'asc' | 'desc'): number {
    // null/undefined 排后面
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
  
    // 数组类型, 直接按照长度排序
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      return order === 'asc' ? aValue.length - bValue.length : bValue.length - aValue.length;
    }
  
    // string类型
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const cmp = aValue.localeCompare(bValue);
      return order === 'asc' ? cmp : -cmp;
    }
  
    // number类型
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
  
    // 其他类型（如混合类型，转字符串比较）
    const cmp = String(aValue).localeCompare(String(bValue));
    return order === 'asc' ? cmp : -cmp;
  }