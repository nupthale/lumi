if (typeof globalThis !== 'undefined') {
    const userAgent = globalThis.navigator?.userAgent?.toLowerCase() || '';

    globalThis.isElectron = userAgent.indexOf(' electron/') > -1;

    if (globalThis.isElectron) {
        document.body.classList.add('electron');

        /* macOS 标题栏高度 */
        document.documentElement.style.setProperty('--appBar-padding-top', '22px');
        document.documentElement.style.setProperty('--fullscreenModal-padding-top', '22px');
    }
}

export const appBarHeight = globalThis.isElectron ? 22 : 0;