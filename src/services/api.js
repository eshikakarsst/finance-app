import axios from 'axios';

const EXCHANGE_API_URL = 'https://v6.exchangerate-api.com/v6';
const EXCHANGE_API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY || 'demo';

export const fetchExchangeRates = async (baseCurrency = 'INR') => {
  try {
    const { data } = await axios.get(`${EXCHANGE_API_URL}/${EXCHANGE_API_KEY}/latest/${baseCurrency}`);
    return data.conversion_rates || {};
  } catch {
    return { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8 };
  }
};
