<script lang="tsx">
import { defineComponent, PropType, watchEffect, ref, onMounted } from 'vue';

import { i18next } from '@collection/i18next';
import { ColumnType } from '@collection/interface';

export default defineComponent({
    props: {
        column: Object as PropType<ColumnType>,
        value: {
            type: [String, Number, Boolean, Array, Object],
        },
        showPlaceholder: Boolean,
        autofocus: {
            type: Boolean,
            default: true,
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        const containerRef = ref();

         // 初始化和外部 value 变化时同步内容
        watchEffect(() => {
            const val = props.value;
            if (containerRef.value && containerRef.value.innerText !== String(val ?? '')) {
                containerRef.value.innerText = val == null ? '' : String(val);
           
                // 将光标移到内容最后
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(containerRef.value);
                range.collapse(false); // false 表示光标移到末尾
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        });

        const handleKeydown = (e: KeyboardEvent) => {
            const allowedKeys = [
                'Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
            ];
            // 允许Ctrl/Command+A/C/V/X/Z/Y等组合键
            if (
                allowedKeys.includes(e.key) ||
                (e.ctrlKey || e.metaKey) // 支持复制粘贴等
            ) {
                return;
            }

            // 允许数字
            if (/^\d$/.test(e.key)) {
                return;
            }

            // 允许输入小数点
            if (e.key === '.') {
                return;
            }

            // 允许负号，但只能在开头且只允许一个
            if (e.key === '-') {
                const el = e.currentTarget as HTMLElement;
                const text = el.innerText;
                const selection = window.getSelection();
                // 只允许在开头输入负号，且当前没有负号
                if (
                    selection && selection.anchorOffset === 0 && !text.includes('-')
                ) {
                    return;
                }
            }

            // 其他情况阻止输入
            e.preventDefault();
        }

        const handleInput = (e) => {
            const text = e.target.innerText;

            // 如果内容只是换行符或空白字符，视为空内容
            const finalValue = text.trim() === '' ? '' : text;

            emit('change', finalValue);
        }

        onMounted(() => {
            if (containerRef.value && props.autofocus) {
                containerRef.value?.focus();
            }
        });

        return () => (
            <div
                class="textEdit w-full text-right"
                contenteditable
                ref={containerRef}
                onKeydown={handleKeydown}
                onBlur={handleInput}
                data-placeholder={props.showPlaceholder ? i18next.t('common.placeholder') : ''}
            />
        );
    }
})
</script>

<style scoped>
.textEdit {
    outline: none!important;
    white-space: wrap;
    position: relative;
}

/* 当元素为空时显示 placeholder */
.textEdit:empty::before {
  content: attr(data-placeholder);
  color: #999;
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
}
</style>