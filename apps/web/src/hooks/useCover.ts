import { ref } from 'vue';

export const useCover = ({ 
    width, 
    height,
}: {
    width: number,
    height: number,
}) => {
    const imageLoaded = ref(false);
    const imageSrc = ref('');

    const getNewCover = async () => {
        const initialUrl = `https://picsum.photos/${width}/${height}`;
      
        try {
            imageLoaded.value = false;

            const response = await fetch(initialUrl);
            const responseUrl = response.url;
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            imageSrc.value = blobUrl; // 保存最终 URL
            setTimeout(() => {
                imageLoaded.value = true;
            }, 100);

            return responseUrl;
        } catch (error) {
            console.error('获取图片失败:', error);
        }
    }

    return {
        getNewCover,
        imageLoaded,
    };
}