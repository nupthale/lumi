import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import i18next from 'i18next';
import 'dayjs/locale/zh-cn'; // 导入中文语言包
import 'dayjs/locale/en'; // 导入英文语言包
import 'dayjs/locale/ja';

dayjs.extend(relativeTime);

i18next.on('languageChanged', (lng) => {
   // Set the locale based on current language
   dayjs.locale(lng);
})

// 根据语言获取日期格式
export const getDateFormat = (locale: string) => {
  switch (locale) {
    case 'zh-cn':
      return {
        thisYear: 'MM月DD日 HH:mm',
        otherYear: 'YYYY年MM月DD日 HH:mm'
      };
    case 'en-US':
      return {
        thisYear: 'h:mm A MMM D',
        otherYear: 'MMM D, YYYY h:mm A'
      };
    default:
      return {
        thisYear: 'MM月DD日 HH:mm',
        otherYear: 'YYYY年MM月DD日 HH:mm'
      };
  }
};

// HTML实体解码函数
export const decodeHTML = (str: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

// 显示相对时间
export const formatTime = (time: string) => {
  const now = dayjs()
  const target = dayjs(time)
  
  const currentLocale = i18next.language;
  const dateFormat = getDateFormat(currentLocale);

  if (now.diff(target, 'minute') < 1) {
    return i18next.t('date.updateTime.justNow');
  } if (now.diff(target, 'hour') < 1) {
    // 1小时内，显示"xx分钟前"
    return i18next.t('date.updateTime.minuteAgo', { count: now.diff(target, 'minute') });
  } else if (now.diff(target, 'day') < 1) {
    // 今天内，显示"今天 HH:mm"
    return i18next.t('date.updateTime.today', { date: target.format('HH:mm') });
  } else if (now.diff(target, 'year') < 1)  {
    // 今年内的日期
    return target.format(dateFormat.thisYear)
  } else {
    // 今年内的日期
    return target.format(dateFormat.otherYear)
  }
}