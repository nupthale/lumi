export enum AppearanceEnum {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system'
}

export type OptionType = {
    label: string;
    value: AppearanceEnum;
};