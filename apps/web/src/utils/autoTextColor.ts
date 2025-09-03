/**
 * 自动文字颜色工具函数
 * 根据背景颜色自动选择黑色或白色文字
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

/**
 * 将十六进制颜色转换为RGB
 */
export function hexToRgb(hex: string): ColorRGB {
  // 移除#号
  const cleanHex = hex.replace('#', '');
  
  // 处理3位和6位十六进制
  const fullHex = cleanHex.length === 3 
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;
  
  const r = parseInt(fullHex.substr(0, 2), 16);
  const g = parseInt(fullHex.substr(2, 2), 16);
  const b = parseInt(fullHex.substr(4, 2), 16);
  
  return { r, g, b };
}

/**
 * 将RGB颜色转换为十六进制
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * 将RGB颜色转换为HSL
 */
export function rgbToHsl(r: number, g: number, b: number): ColorHSL {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}

/**
 * 计算颜色的亮度 (YIQ公式)
 * 返回0-255之间的值，值越大越亮
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * 计算颜色的相对亮度 (WCAG标准)
 * 返回0-1之间的值
 */
export function calculateRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 计算对比度比率
 */
export function calculateContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 根据背景颜色自动选择文字颜色
 * 使用YIQ公式，简单快速
 */
export function getAutoTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  
  // 阈值128，大于128使用黑色文字，小于128使用白色文字
  return luminance >= 128 ? '#000000' : '#ffffff';
}

/**
 * 根据背景颜色自动选择文字颜色 (WCAG标准)
 * 使用WCAG对比度标准，更准确
 */
export function getAutoTextColorWCAG(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  const bgLuminance = calculateRelativeLuminance(rgb.r, rgb.g, rgb.b);
  
  // 计算与黑色和白色的对比度
  const blackContrast = calculateContrastRatio(bgLuminance, 0);
  const whiteContrast = calculateContrastRatio(bgLuminance, 1);
  
  // 选择对比度更高的颜色
  return blackContrast > whiteContrast ? '#000000' : '#ffffff';
}

/**
 * 获取最佳文字颜色，确保最小对比度
 */
export function getBestTextColor(
  backgroundColor: string, 
  minContrastRatio: number = 4.5
): string {
  const rgb = hexToRgb(backgroundColor);
  const bgLuminance = calculateRelativeLuminance(rgb.r, rgb.g, rgb.b);
  
  // 测试黑色文字
  const blackContrast = calculateContrastRatio(bgLuminance, 0);
  if (blackContrast >= minContrastRatio) {
    return '#000000';
  }
  
  // 测试白色文字
  const whiteContrast = calculateContrastRatio(bgLuminance, 1);
  if (whiteContrast >= minContrastRatio) {
    return '#ffffff';
  }
  
  // 如果都不满足，选择对比度更高的
  return blackContrast > whiteContrast ? '#000000' : '#ffffff';
}

/**
 * 获取多个文字颜色选项
 */
export function getTextColorOptions(backgroundColor: string): {
  primary: string;
  secondary: string;
  accent: string;
} {
  const rgb = hexToRgb(backgroundColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // 主文字颜色
  const primary = getAutoTextColorWCAG(backgroundColor);
  
  // 次要文字颜色 (降低对比度)
  const secondary = hsl.l > 50 ? '#666666' : '#cccccc';
  
  // 强调文字颜色
  const accent = hsl.l > 50 ? '#333333' : '#ffffff';
  
  return { primary, secondary, accent };
}

/**
 * 为DOM元素设置自动文字颜色
 */
export function setAutoTextColor(element: HTMLElement, backgroundColor?: string): void {
  const bgColor = backgroundColor || getComputedStyle(element).backgroundColor;
  
  // 处理rgb/rgba格式
  let hexColor = bgColor;
  if (bgColor.startsWith('rgb')) {
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
    }
  }
  
  const textColor = getAutoTextColorWCAG(hexColor);
  element.style.color = textColor;
  element.style.setProperty('--auto-text-color', textColor);
}

/**
 * 为所有具有特定类名的元素设置自动文字颜色
 */
export function setAutoTextColorForClass(className: string): void {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      setAutoTextColor(element);
    }
  });
}

/**
 * 创建CSS自定义属性
 */
export function createAutoTextColorCSS(backgroundColor: string): string {
  const textColor = getAutoTextColorWCAG(backgroundColor);
  return `--auto-text-color: ${textColor};`;
}

/**
 * 批量处理颜色数组
 */
export function processColorArray(colors: string[]): Array<{
  background: string;
  text: string;
  contrast: number;
}> {
  return colors.map(color => {
    const rgb = hexToRgb(color);
    const bgLuminance = calculateRelativeLuminance(rgb.r, rgb.g, rgb.b);
    const textColor = getAutoTextColorWCAG(color);
    const textRgb = hexToRgb(textColor);
    const textLuminance = calculateRelativeLuminance(textRgb.r, textRgb.g, textRgb.b);
    const contrast = calculateContrastRatio(bgLuminance, textLuminance);
    
    return {
      background: color,
      text: textColor,
      contrast
    };
  });
}

// 导出默认函数
export default getAutoTextColor; 