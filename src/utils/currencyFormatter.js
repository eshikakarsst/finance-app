export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const CATEGORIES = [
  'Food', 'Travel', 'Rent', 'Shopping', 'Entertainment',
  'Health', 'Utilities', 'Subscriptions', 'Salary', 'Freelance',
  'Investment', 'Education', 'Other',
];

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Travel: '#3b82f6',
  Rent: '#8b5cf6',
  Shopping: '#ec4899',
  Entertainment: '#f59e0b',
  Health: '#22c55e',
  Utilities: '#06b6d4',
  Subscriptions: '#7c5cfc',
  Salary: '#10b981',
  Freelance: '#6366f1',
  Investment: '#14b8a6',
  Education: '#f43f5e',
  Other: '#9ca3af',
};

export const formatCurrency = (amount, symbol = '₹') => {
  return symbol + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(amount));
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const getMonthlyData = (transactions) => {
  const months = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    if (!months[key]) months[key] = { name: label, income: 0, expenses: 0 };
    if (t.type === 'income') months[key].income += t.amount;
    else months[key].expenses += t.amount;
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
    .slice(-6);
};