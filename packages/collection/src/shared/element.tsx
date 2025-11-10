export function closest(element, selector) {
    let current = element;
    // 遍历父元素链（包括自身）
    while (current) {
      // 检查当前元素是否匹配选择器
      if (current.matches(selector)) {
        return current;
      }
      // 向上移动到父元素
      current = current.parentElement;
    }
    return null;
  }