import { computed } from 'vue';

import { useQuery } from '@tanstack/vue-query';

// 检测操作系统
const isMacOS = () => {
    if (typeof window !== 'undefined') {
        return navigator.platform.toLowerCase().includes('mac');
    }
    return false;
};

// bytes字节转为KB、MB、GB
const formatSize = (size: number) => {
    // macOS 使用 1000 进制，其他系统使用 1024 进制
    const base = isMacOS() ? 1000 : 1024;
    
    if (!size) return size;

    if (size < base) {
        return [size, 'B']
    } else if (size < base * base) {
        return [(size / base).toFixed(2), 'KB'];
    } else if (size < base * base * base) {
        return [(size / base / base).toFixed(2), 'MB'];
    } else {
        return [(size / base / base / base).toFixed(2), 'GB'];
    }
}

export const useStorage = () => {
    const { data, isPending } = useQuery({
        queryKey: ['storage'],
        queryFn: async () => {
            return {
                size: undefined,
            };
        },
        // 每1min请求一次
        refetchInterval: 1000 * 60,
    });

    const usedSize = computed(() => {
        if (data.value?.size) {
            return formatSize(data.value.size);
        }

        return null;
    });

    return {
        isPending,
        usedSize,
    };
}