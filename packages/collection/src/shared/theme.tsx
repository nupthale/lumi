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
    primaryTextColor: () => getCssVar('primary-text-color'),
} as const; 

export const getTextColor = (color: string) => {
    return color[2];
}