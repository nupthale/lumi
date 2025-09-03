/**
 * Get CSS custom property (CSS variable) value
 * @param propertyName The name of the CSS custom property (without -- prefix)
 * @returns The value of the CSS custom property
 */
export function getCssVar(propertyName: string): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(`--${propertyName}`)
        .trim();
}

// Predefined theme tokens
export const themeTokens = {
    homeSiderBg: () => getCssVar('home-sider-bg'),
    textColor: () => getCssVar('text-color'),
    lightTextColor: () => getCssVar('light-text-color'),
    titleText: () => getCssVar('title-text'),
    wikiSubTitleText: () => getCssVar('wiki-subTitle-color'),
} as const; 

// 切换主题
export function switchTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
}