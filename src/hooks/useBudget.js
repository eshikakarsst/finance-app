import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { format } from 'date-fns';

export function useBudget() {
  const { transactions, budget, updateBudget } = useFinance();

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const remaining = budget.monthlyBudget - currentMonthExpenses;
  const percentUsed = budget.monthlyBudget > 0
    ? Math.min((currentMonthExpenses / budget.monthlyBudget) * 100, 100)
    : 0;
  const isOverBudget = currentMonthExpenses > budget.monthlyBudget;

  const categoryBreakdown = useMemo(() => {
    const now = new Date();
    const map = {};
    transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear();
      })
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([category, spent]) => ({
        category, spent,
        budgeted: budget.categoryBudgets?.[category] || 0,
        percent: budget.categoryBudgets?.[category]
          ? Math.min((spent / budget.categoryBudgets[category]) * 100, 100)
          : 0,
      }))
      .sort((a, b) => b.spent - a.spent);
  }, [transactions, budget]);

  return {
    budget, updateBudget,
    currentMonthExpenses, remaining, percentUsed, isOverBudget,
    categoryBreakdown,
    currentMonth: format(new Date(), 'MMMM yyyy'),
  };
}