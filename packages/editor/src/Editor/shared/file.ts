import { message } from 'ant-design-vue';

export const download = async (url: string, name: string) => {
    try {
        const hide = message.loading('下载中...');

        // 获取图片数据
        const response = await fetch(url);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        setTimeout(() => {
            hide();
        }, 800);
    } catch (error) {
        console.error('下载失败:', error);
    }
}