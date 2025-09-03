import { CurrencyEnum } from '@collection/interface';

export const currencyList = [
    CurrencyEnum.CNY,
    CurrencyEnum.USD,
    CurrencyEnum.EUR,
    CurrencyEnum.GBP,
    CurrencyEnum.AED,
    CurrencyEnum.AUD,
    CurrencyEnum.BRL,
    CurrencyEnum.CAD,
    CurrencyEnum.CHF,
    CurrencyEnum.HKD,
    CurrencyEnum.INR,
    CurrencyEnum.JPY,
    CurrencyEnum.KRW,
    CurrencyEnum.MXN,
    CurrencyEnum.SGD,
    CurrencyEnum.TWD,
    CurrencyEnum.VND,
];

export const getCurrencySign = (currency: CurrencyEnum) => {
    const map = {
        [CurrencyEnum.CNY]: '¥',
        [CurrencyEnum.USD]: '$',
        [CurrencyEnum.EUR]: '€',
        [CurrencyEnum.GBP]: '£',
        [CurrencyEnum.AED]: 'dh',
        [CurrencyEnum.AUD]: '$',
        [CurrencyEnum.BRL]: 'R$',
        [CurrencyEnum.CAD]: '$',
        [CurrencyEnum.CHF]: 'CHF',
        [CurrencyEnum.HKD]: '$',
        [CurrencyEnum.INR]: '₹',
        [CurrencyEnum.JPY]: '¥',
        [CurrencyEnum.KRW]: '₩',
        [CurrencyEnum.MXN]: '$',
        [CurrencyEnum.SGD]: '$',
        [CurrencyEnum.TWD]: 'NT$',
        [CurrencyEnum.VND]: '₫',
    };

    return map[currency];
}