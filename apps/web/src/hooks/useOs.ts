import { ref, onMounted } from 'vue';

// 检测平台的函数
const detectPlatform = async () => {
  // 方法1: 检查clientAPI中的平台信息
  if ((window as any).clientAPI?.getPlatform) {
    try {
      return await (window as any).clientAPI.getPlatform();
    } catch (error) {
      console.warn('Failed to get platform from clientAPI:', error);
    }
  }
  
  // 方法2: 通过User Agent检测（fallback）
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('windows')) return 'win32';
  if (userAgent.includes('mac')) return 'darwin';
  if (userAgent.includes('linux')) return 'linux';
  
  return 'browser'; // 默认浏览器环境
};

export const useOs = () => {
    const os = ref();
    const isWindows = ref();

    onMounted(async () => {
        const platform = await detectPlatform();
        os.value = platform;
        isWindows.value = platform === 'win32';

        window.isWindows = platform === 'win32';

        document.body.classList.add(platform);
    });

    return {
        os,
        isWindows,
    };
}