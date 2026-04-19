import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [filters, setFilters] = useState({ category: '', type: '', startDate: '', endDate: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }
    if (filters.category) result = result.filter(t => t.category === filters.category);
    if (filters.type) result = result.filter(t => t.type === filters.type);
    if (filters.startDate) result = result.filter(t => new Date(t.date) >= new Date(filters.startDate));
    if (filters.endDate) result = result.filter(t => new Date(t.date) <= new Date(filters.endDate));

    result.sort((a, b) => {
      let va, vb;
      if (sortBy === 'date') { va = new Date(a.date); vb = new Date(b.date); }
      else if (sortBy === 'amount') { va = a.amount; vb = b.amount; }
      else { va = a.category; vb = b.category; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [transactions, searchQuery, filters, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const resetFilters = () => {
    setFilters({ category: '', type: '', startDate: '', endDate: '' });
    setSearchQuery('');
  };

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    addTransaction, updateTransaction, deleteTransaction,
    filters, setFilters, searchQuery, setSearchQuery,
    sortBy, sortDir, toggleSort, resetFilters,
  };
}