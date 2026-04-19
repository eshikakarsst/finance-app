import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../hooks/useCurrency';
import SpendingPieChart from '../components/Charts/SpendingPieChart';
import MonthlyTrendChart from '../components/Charts/MonthlyTrendChart';
import IncomeExpenseBar from '../components/Charts/IncomeExpenseBar';
import { CATEGORY_COLORS, getMonthlyData } from '../utils/currencyFormatter';

export default function Analytics() {
  const { transactions, getTotalIncome, getTotalExpenses, getNetBalance, getCategorySpending, getTopCategory } = useFinance();
  const { format } = useCurrency();
  const [activeTab, setActiveTab] = useState('overview');

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netBalance = getNetBalance();
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;
  const categoryData = getCategorySpending();
  const topCategory = getTopCategory();
  const monthlyData = getMonthlyData(transactions);
  const avgMonthlyExpense = monthlyData.length > 0 ? monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length : 0;
  const recurringExpenses = transactions.filter(t => t.type === 'expense' && t.recurring).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Deep insights into your financial behavior</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Income', value: format(totalIncome), color: 'var(--income)' },
          { label: 'Total Expenses', value: format(totalExpenses), color: 'var(--expense)' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: savingsRate >= 0 ? 'var(--income)' : 'var(--expense)' },
          { label: 'Avg Monthly Spend', value: format(avgMonthlyExpense), color: 'var(--accent-light)' },
        ].map((m, i) => (
          <motion.div key={m.label} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: m.color }}>{m.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 4 }}>
        {['overview', 'spending', 'trends'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '9px 16px', borderRadius: 8, border: 'none', background: activeTab === tab ? 'var(--accent)' : 'transparent', color: activeTab === tab ? '#fff' : 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize', cursor: 'pointer', transition: 'var(--transition)' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Spending Breakdown</h3>
              <SpendingPieChart transactions={transactions} />
            </div>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Income vs Expenses</h3>
              <IncomeExpenseBar transactions={transactions} />
            </div>
          </div>
          <div className="grid-3">
            {[
              { label: 'Top Category', value: topCategory?.name || 'N/A', sub: topCategory ? format(topCategory.value) : '' },
              { label: 'Recurring Expenses', value: format(recurringExpenses), sub: `${transactions.filter(t => t.recurring && t.type === 'expense').length} items` },
              { label: 'Net Balance', value: (netBalance >= 0 ? '+' : '') + format(netBalance), sub: netBalance >= 0 ? 'Positive cashflow' : 'Negative cashflow', color: netBalance >= 0 ? 'var(--income)' : 'var(--expense)' },
            ].map((s, i) => (
              <motion.div key={s.label} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'spending' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Category Breakdown</h3>
            {categoryData.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">📊</div><h3>No expense data</h3></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {categoryData.map(({ name, value }) => {
                  const pct = totalExpenses > 0 ? (value / totalExpenses) * 100 : 0;
                  const color = CATEGORY_COLORS[name] || '#9ca3af';
                  return (
                    <div key={name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem' }}>{name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <span style={{ color, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{format(value)}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', minWidth: 40, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'trends' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Monthly Spending Trend</h3>
              <MonthlyTrendChart transactions={transactions} />
            </div>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Income vs Expenses by Month</h3>
              <IncomeExpenseBar transactions={transactions} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}