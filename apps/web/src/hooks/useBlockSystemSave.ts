import { onMounted, onUnmounted } from 'vue';

export const useBlockSystemSave = () => {
    const stopSystemSave = (event) => {
        // 检查是否按下了 Ctrl + S
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            // 阻止默认的保存行为
            event.preventDefault();
            
            // 返回 false 以确保事件不会继续传播
            return false;
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', stopSystemSave);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', stopSystemSave);
    });
}