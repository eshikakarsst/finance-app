import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../hooks/useCurrency';
import { useBudget } from '../hooks/useBudget';
import BudgetCard from '../components/BudgetCard';
import SpendingPieChart from '../components/Charts/SpendingPieChart';
import MonthlyTrendChart from '../components/Charts/MonthlyTrendChart';
import TransactionCard from '../components/TransactionCard';
import { RiArrowRightLine, RiAddLine, RiTrophyLine } from 'react-icons/ri';
import { fetchExchangeRates } from '../services/api';
import CurrencyExchange from '../components/CurrencyExchange';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Dashboard() {
  const { transactions, getTotalIncome, getTotalExpenses, getNetBalance, getTopCategory, setExchangeRates, setRatesLoading } = useFinance();
  const { format } = useCurrency();
  const { percentUsed, isOverBudget } = useBudget();
  const recentTransactions = transactions.slice(0, 5);
  const topCategory = getTopCategory();
  const balance = getNetBalance();

  useEffect(() => {
    setRatesLoading(true);
    fetchExchangeRates('INR').then(rates => {
      setExchangeRates(rates);
      setRatesLoading(false);
    });
  }, []);

  return (
    <div className="page-container">
      <motion.div className="page-header" initial="hidden" animate="show" variants={container}>
        <motion.div variants={fadeUp}>
          <h1 className="page-title">Good Morning 👋</h1>
          <p className="page-subtitle">Here's your financial overview for today</p>
        </motion.div>
        <motion.div variants={fadeUp} style={{ marginTop: 16 }}>
          <Link to="/transactions/new">
            <button className="btn btn-primary"><RiAddLine size={16} /> Add Transaction</button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div className="grid-4" style={{ marginBottom: 28 }} initial="hidden" animate="show" variants={container}>
        {[
          { label: 'Total Income', value: getTotalIncome(), type: 'income', prefix: '+' },
          { label: 'Total Expenses', value: getTotalExpenses(), type: 'expense', prefix: '-' },
          { label: 'Net Balance', value: Math.abs(balance), type: 'balance', prefix: balance >= 0 ? '+' : '-' },
          { label: 'Transactions', value: null, type: 'neutral', count: transactions.length },
        ].map((s) => (
          <motion.div key={s.label} className={`stat-card ${s.type}`} variants={fadeUp}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-value ${s.type}`}>
              {s.count !== undefined ? s.count : `${s.prefix}${format(s.value)}`}
            </div>
            <div className="stat-sub">{s.type === 'balance' ? `${percentUsed.toFixed(0)}% budget used` : 'all time'}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Spending by Category</h3>
          <SpendingPieChart transactions={transactions} />
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Monthly Trend</h3>
          <MonthlyTrendChart transactions={transactions} />
        </motion.div>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        <BudgetCard />
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Top Spending Category</h3>
          {topCategory ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RiTrophyLine size={22} color="var(--accent-light)" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>{topCategory.name}</div>
                <div style={{ color: 'var(--expense)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>{format(topCategory.value)}</div>
              </div>
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>No expense data</p>}
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Budget health</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: isOverBudget ? 'var(--expense)' : 'var(--income)', fontSize: '0.9rem' }}>
              {isOverBudget ? '⚠️ Over limit' : '✅ On track'}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Recent Transactions</h3>
          <Link to="/transactions">
            <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>View all <RiArrowRightLine size={13} /></button>
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💸</div>
            <h3>No transactions yet</h3>
            <p>Add your first transaction to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentTransactions.map(t => <TransactionCard key={t.id} transaction={t} onEdit={() => { }} />)}
          </div>
        )}
        {/* Currency Exchange */}
        <motion.div style={{ marginBottom: 28 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <CurrencyExchange />
        </motion.div>
      </motion.div>
    </div>
  );
}