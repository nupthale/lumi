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
                class="textEdit w-full"
                contenteditable
                ref={containerRef}
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