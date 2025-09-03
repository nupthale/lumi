import fallbackI18next from 'i18next';

export const i18next  = (window as any).i18next || fallbackI18next;