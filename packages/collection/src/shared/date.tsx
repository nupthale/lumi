import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文语言包

dayjs.locale('zh-cn');

export const dateFormats = [
    // Standard formats (支持本地化)
    'M/D/YYYY',    // 1/31/2025
    'M/D',         // 1/31
    'MMMM D, YYYY', // January 31, 2025 (本地化)
    'MMMM D',      // January 31 (本地化)
    'ddd, MMMM D', // Fri, January 31 (本地化)
    'ddd, MMMM D, YYYY', // Fri, January 31, 2025 (本地化)
    
    // Standard formats
    'YYYY-MM-DD',
    'YYYY-MM',
    'YYYY',
    'MM-DD',

    // Additional formats from your requirements
    'MMMM YYYY',   // January 2025 (本地化)
    'dddd',        // Friday (本地化)
    'MMMM',        // January (本地化)
    'D',           // 31
];

export const dateTimeFormats = [
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm',
];

export const timeFormats = [
    // 时间格式 (24小时制)
    'HH:mm:ss',    // 14:30:25
    'HH:mm',       // 14:30

    // 时间格式 (12小时制)
    'hh:mm:ss A',  // 02:30:25 PM
    'hh:mm A',     // 02:30 PM
    'h:mm:ss A',   // 2:30:25 PM
    'h:mm A',      // 2:30 PM
];

export const formatText = (format: string) => {
    return dayjs().format(format);
}