# 自动文字颜色功能

根据背景颜色自动选择白色或黑色文字，确保良好的可读性和对比度。

## 功能特性

- 🎨 **多种实现方案**: CSS混合模式、JavaScript计算、Vue组合式函数
- 📱 **响应式支持**: 支持深色模式、高对比度模式
- ⚡ **高性能**: 使用优化的算法计算对比度
- 🎯 **WCAG标准**: 符合Web内容无障碍指南
- 🔧 **易于使用**: 提供多种使用方式

## 快速开始

### 1. 基础JavaScript使用

```typescript
import { getAutoTextColor, getAutoTextColorWCAG } from '@/utils/autoTextColor'

// 简单使用 (YIQ公式)
const textColor = getAutoTextColor('#ff6b6b') // 返回 '#ffffff' 或 '#000000'

// WCAG标准 (更准确)
const textColorWCAG = getAutoTextColorWCAG('#ff6b6b')
```

### 2. Vue组合式函数

```vue
<template>
  <div :style="{ backgroundColor: bgColor, color: textColor }">
    自动文字颜色
  </div>
</template>

<script setup>
import { useAutoTextColor } from '@/composables/useAutoTextColor'

const { textColor, backgroundColor, contrast } = useAutoTextColor({
  backgroundColor: '#ff6b6b',
  useWCAG: true,
  minContrastRatio: 4.5
})
</script>
```

### 3. CSS类使用

```html
<!-- 使用预设背景色 -->
<div class="bg-auto-primary text-auto">
  主要背景色文字
</div>

<!-- 使用混合模式 -->
<div class="bg-gradient">
  <span class="auto-text-mix">混合模式文字</span>
</div>
```

## API 参考

### JavaScript 工具函数

#### `getAutoTextColor(backgroundColor: string): string`
使用YIQ公式计算文字颜色，简单快速。

```typescript
getAutoTextColor('#ffffff') // '#000000'
getAutoTextColor('#000000') // '#ffffff'
getAutoTextColor('#ff6b6b') // '#ffffff'
```

#### `getAutoTextColorWCAG(backgroundColor: string): string`
使用WCAG标准计算文字颜色，更准确。

```typescript
getAutoTextColorWCAG('#ffffff') // '#000000'
getAutoTextColorWCAG('#000000') // '#ffffff'
```

#### `getBestTextColor(backgroundColor: string, minContrastRatio?: number): string`
确保最小对比度比率的文字颜色。

```typescript
getBestTextColor('#ff6b6b', 4.5) // 确保4.5:1的对比度
```

### Vue组合式函数

#### `useAutoTextColor(options?: AutoTextColorOptions)`

```typescript
interface AutoTextColorOptions {
  backgroundColor?: string        // 初始背景色
  minContrastRatio?: number       // 最小对比度比率
  useWCAG?: boolean              // 是否使用WCAG标准
  watchElement?: boolean         // 是否监听元素变化
}

interface AutoTextColorResult {
  textColor: string              // 计算出的文字颜色
  backgroundColor: string        // 当前背景色
  contrast: number              // 对比度比率
  options: {                    // 颜色选项
    primary: string
    secondary: string
    accent: string
  }
  setBackgroundColor: (color: string) => void
  setElementColor: (element: HTMLElement) => void
  calculateForElement: (element: HTMLElement) => void
}
```

### CSS类

#### 背景色预设类
- `.bg-auto-light` - 浅色背景
- `.bg-auto-dark` - 深色背景
- `.bg-auto-primary` - 主要色背景
- `.bg-auto-success` - 成功色背景
- `.bg-auto-warning` - 警告色背景
- `.bg-auto-danger` - 危险色背景
- `.bg-auto-info` - 信息色背景

#### 文字颜色类
- `.text-auto` - 自动文字颜色
- `.text-auto-mix` - 混合模式文字
- `.text-auto-filter` - 滤镜文字
- `.auto-text-responsive` - 响应式文字

#### 混合模式类
- `.auto-text-mix-blend` - 混合模式
- `.auto-text-pseudo` - 伪元素方案
- `.auto-text-grid` - Grid方案

## 使用示例

### 动态背景色

```vue
<template>
  <div class="dynamic-container">
    <input 
      type="color" 
      v-model="bgColor"
      @input="updateColor"
    >
    <div 
      class="content-box"
      :style="{ 
        backgroundColor: bgColor,
        color: textColor
      }"
    >
      <h2>动态文字颜色</h2>
      <p>背景色: {{ bgColor }}</p>
      <p>文字色: {{ textColor }}</p>
      <p>对比度: {{ contrast.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAutoTextColor } from '@/composables/useAutoTextColor'

const bgColor = ref('#ff6b6b')
const { textColor, contrast, setBackgroundColor } = useAutoTextColor({
  backgroundColor: bgColor.value
})

const updateColor = () => {
  setBackgroundColor(bgColor.value)
}
</script>
```

### 批量处理

```vue
<template>
  <div class="color-grid">
    <div 
      v-for="(result, index) in results" 
      :key="index"
      class="color-item"
      :style="{ 
        backgroundColor: result.background,
        color: result.text
      }"
    >
      <span>{{ result.background }}</span>
      <small>对比度: {{ result.contrast.toFixed(2) }}</small>
    </div>
  </div>
</template>

<script setup>
import { useBatchAutoTextColor } from '@/composables/useAutoTextColor'

const colors = [
  '#ffffff', '#000000', '#ff6b6b', '#4ecdc4',
  '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'
]

const { results } = useBatchAutoTextColor(colors)
</script>
```

### 元素自动检测

```vue
<template>
  <div ref="elementRef" class="auto-element">
    <span>自动检测背景色</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useElementAutoTextColor } from '@/composables/useAutoTextColor'

const elementRef = ref()
const { textColor, backgroundColor, contrast } = useElementAutoTextColor(elementRef)
</script>
```

## 算法说明

### YIQ公式
```typescript
const luminance = (r * 299 + g * 587 + b * 114) / 1000
return luminance >= 128 ? '#000000' : '#ffffff'
```

### WCAG相对亮度
```typescript
const relativeLuminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
const contrastRatio = (lighter + 0.05) / (darker + 0.05)
```

## 浏览器支持

- ✅ Chrome 41+
- ✅ Firefox 32+
- ✅ Safari 8+
- ✅ Edge 12+
- ✅ IE 11+ (部分功能)

## 性能优化

1. **缓存计算结果**: 相同颜色只计算一次
2. **批量处理**: 支持数组批量计算
3. **响应式更新**: 只在必要时重新计算
4. **CSS优先**: 优先使用CSS方案，减少JavaScript计算

## 无障碍支持

- 符合WCAG 2.1 AA标准
- 支持高对比度模式
- 支持减少动画模式
- 支持屏幕阅读器

## 故障排除

### 常见问题

1. **颜色不准确**
   - 检查颜色格式是否为有效的十六进制
   - 尝试使用WCAG标准而不是YIQ公式

2. **性能问题**
   - 避免频繁的颜色计算
   - 使用CSS类而不是JavaScript计算

3. **浏览器兼容性**
   - 检查浏览器是否支持CSS混合模式
   - 提供降级方案

### 调试工具

```typescript
// 检查对比度
import { calculateContrastRatio } from '@/utils/autoTextColor'
const contrast = calculateContrastRatio(bgLuminance, textLuminance)
console.log('对比度:', contrast)

// 批量测试
import { processColorArray } from '@/utils/autoTextColor'
const results = processColorArray(['#ff0000', '#00ff00', '#0000ff'])
console.table(results)
```

## 更新日志

### v1.0.0
- 初始版本
- 支持基础自动文字颜色功能
- 提供JavaScript工具函数和Vue组合式函数
- 支持CSS类和混合模式

## 贡献

欢迎提交Issue和Pull Request来改进这个功能！ 