import { useFinance } from '../context/FinanceContext';

export function useCurrency() {
  const { currency, exchangeRates } = useFinance();

  const format = (amount, targetCurrency) => {
    const curr = targetCurrency || currency;
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const sym = symbols[curr] || curr + ' ';
    if (curr === 'INR') {
      return sym + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(amount));
    }
    const rate = exchangeRates[curr] || 1;
    const converted = amount / (exchangeRates['INR'] || 1) * rate;
    return sym + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(converted));
  };

  return { format, currency };
}