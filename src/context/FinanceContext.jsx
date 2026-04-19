import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

const SAMPLE_TRANSACTIONS = [
  { id: uuidv4(), title: 'Monthly Salary', amount: 75000, category: 'Salary', type: 'income', date: '2024-03-01', notes: 'March salary', recurring: true },
  { id: uuidv4(), title: 'Apartment Rent', amount: 18000, category: 'Rent', type: 'expense', date: '2024-03-02', notes: 'March rent', recurring: true },
  { id: uuidv4(), title: 'Grocery Shopping', amount: 3200, category: 'Food', type: 'expense', date: '2024-03-05', notes: 'Big Basket order', recurring: false },
  { id: uuidv4(), title: 'Netflix', amount: 649, category: 'Subscriptions', type: 'expense', date: '2024-03-06', notes: 'Streaming', recurring: true },
  { id: uuidv4(), title: 'Uber Rides', amount: 1800, category: 'Travel', type: 'expense', date: '2024-03-10', notes: 'Office commute', recurring: false },
  { id: uuidv4(), title: 'Freelance Project', amount: 25000, category: 'Freelance', type: 'income', date: '2024-03-12', notes: 'Web design project', recurring: false },
  { id: uuidv4(), title: 'Electricity Bill', amount: 2100, category: 'Utilities', type: 'expense', date: '2024-03-14', notes: 'BESCOM bill', recurring: true },
  { id: uuidv4(), title: 'Gym Membership', amount: 1500, category: 'Health', type: 'expense', date: '2024-03-15', notes: 'Monthly membership', recurring: true },
  { id: uuidv4(), title: 'Amazon Shopping', amount: 4500, category: 'Shopping', type: 'expense', date: '2024-03-18', notes: 'Electronics', recurring: false },
  { id: uuidv4(), title: 'Movie Night', amount: 800, category: 'Entertainment', type: 'expense', date: '2024-03-20', notes: 'PVR tickets', recurring: false },
  { id: uuidv4(), title: 'Spotify', amount: 119, category: 'Subscriptions', type: 'expense', date: '2024-03-21', notes: 'Music streaming', recurring: true },
  { id: uuidv4(), title: 'Restaurant Dinner', amount: 2400, category: 'Food', type: 'expense', date: '2024-03-25', notes: 'Team dinner', recurring: false },
  { id: uuidv4(), title: 'Dividend Income', amount: 8500, category: 'Investment', type: 'income', date: '2024-03-28', notes: 'Mutual fund dividend', recurring: false },
  { id: uuidv4(), title: 'Internet Bill', amount: 999, category: 'Utilities', type: 'expense', date: '2024-03-28', notes: 'Airtel Fiber', recurring: true },
  { id: uuidv4(), title: 'Weekend Trip', amount: 7500, category: 'Travel', type: 'expense', date: '2024-03-30', notes: 'Coorg trip', recurring: false },
];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_transactions');
      return saved ? JSON.parse(saved) : SAMPLE_TRANSACTIONS;
    } catch { return SAMPLE_TRANSACTIONS; }
  });

  const [budget, setBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_budget');
      return saved ? JSON.parse(saved) : { monthlyBudget: 50000, categoryBudgets: {} };
    } catch { return { monthlyBudget: 50000, categoryBudgets: {} }; }
  });

  const [currency, setCurrency] = useState('INR');
  const [exchangeRates, setExchangeRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_budget', JSON.stringify(budget));
  }, [budget]);

  const addTransaction = (data) => {
    const newTransaction = { ...data, id: uuidv4() };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id, data) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (newBudget) => {
    setBudget(prev => ({ ...prev, ...newBudget }));
  };

  const getTotalIncome = (txns = transactions) =>
    txns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  const getTotalExpenses = (txns = transactions) =>
    txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const getNetBalance = (txns = transactions) =>
    getTotalIncome(txns) - getTotalExpenses(txns);

  const getCategorySpending = (txns = transactions) => {
    const map = {};
    txns.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  const getTopCategory = (txns = transactions) => {
    const cats = getCategorySpending(txns);
    return cats.length > 0 ? cats[0] : null;
  };

  const value = {
    transactions, addTransaction, updateTransaction, deleteTransaction,
    budget, updateBudget,
    currency, setCurrency, exchangeRates, setExchangeRates, ratesLoading, setRatesLoading,
    getTotalIncome, getTotalExpenses, getNetBalance, getCategorySpending, getTopCategory,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}

export default FinanceContext;