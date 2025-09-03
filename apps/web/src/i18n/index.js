import i18next from 'i18next';
import dayjs from 'dayjs';

import enUs from './locales/en-US';
import ja from './locales/ja';
import zhCn from './locales/zh-CN';

const defaultLng = localStorage.getItem('language') || 'zh-CN';

dayjs.locale(defaultLng) // 使用中文

// 全部都是用window上的i18next， 要不然editor复用不到
window.i18next = i18next;

export const initI18n = async () => {
    try {
        await i18next.init({
            lng: defaultLng,
            debug: true,
            fallbackLng: 'en', // 添加回退语言
            resources: {
                'en-US': { translation: enUs },
                ja: { translation: ja },
                'zh-CN': { translation: zhCn },
            }
        });
    } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // 可以在这里添加错误处理逻辑
    }
};