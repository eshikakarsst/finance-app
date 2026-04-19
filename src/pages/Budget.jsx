import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';
import { CATEGORY_COLORS } from '../utils/currencyFormatter';
import { RiEdit2Line, RiSaveLine, RiAlarmWarningLine, RiCheckLine } from 'react-icons/ri';

const schema = yup.object({ monthlyBudget: yup.number().typeError('Must be a number').positive('Must be positive').required() });

export default function Budget() {
  const { budget, updateBudget, currentMonthExpenses, remaining, percentUsed, isOverBudget, categoryBreakdown, currentMonth } = useBudget();
  const { format } = useCurrency();
  const [editingBudget, setEditingBudget] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catBudgetValue, setCatBudgetValue] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { monthlyBudget: budget.monthlyBudget },
  });

  const onSubmitBudget = (data) => {
    updateBudget({ monthlyBudget: Number(data.monthlyBudget) });
    toast.success('Budget updated!');
    setEditingBudget(false);
  };

  const saveCategoryBudget = (category) => {
    updateBudget({ categoryBudgets: { ...budget.categoryBudgets, [category]: Number(catBudgetValue) } });
    toast.success(`${category} budget set`);
    setEditingCategory(null);
    setCatBudgetValue('');
  };

  const barColor = (pct) => pct > 100 ? 'var(--expense)' : pct > 80 ? '#f59e0b' : 'var(--income)';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Budget Tracker</h1>
        <p className="page-subtitle">{currentMonth} — Track your spending limits</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: isOverBudget ? 'var(--expense)' : 'var(--accent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Monthly Budget</h3>
            <button className="btn btn-secondary" onClick={() => setEditingBudget(e => !e)} style={{ padding: '7px 12px', fontSize: '0.82rem' }}>
              <RiEdit2Line size={14} /> {editingBudget ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingBudget ? (
            <form onSubmit={handleSubmit(onSubmitBudget)} style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <input className="form-input" type="number" placeholder="Monthly budget (₹)" {...register('monthlyBudget')} />
                {errors.monthlyBudget && <span className="form-error">{errors.monthlyBudget.message}</span>}
              </div>
              <button className="btn btn-primary" type="submit" style={{ padding: '10px 16px' }}><RiSaveLine size={15} /> Save</button>
            </form>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>{format(budget.monthlyBudget)}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>per month limit</div>
              <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(percentUsed, 100)}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: isOverBudget ? 'var(--expense)' : percentUsed > 80 ? '#f59e0b' : 'var(--accent)', borderRadius: 5 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Spent</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: isOverBudget ? 'var(--expense)' : 'var(--text-primary)' }}>{format(currentMonthExpenses)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Used</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: isOverBudget ? 'var(--expense)' : 'var(--accent-light)' }}>{percentUsed.toFixed(1)}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Remaining</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: remaining >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                    {remaining >= 0 ? '' : '-'}{format(Math.abs(remaining))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20 }}>Budget Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Monthly Budget', value: format(budget.monthlyBudget), icon: '🎯' },
              { label: 'Total Spent', value: format(currentMonthExpenses), icon: '💸', color: isOverBudget ? 'var(--expense)' : undefined },
              { label: 'Remaining', value: (remaining >= 0 ? '' : '-') + format(Math.abs(remaining)), icon: '💰', color: remaining >= 0 ? 'var(--income)' : 'var(--expense)' },
              { label: 'Usage %', value: percentUsed.toFixed(1) + '%', icon: '📊', color: isOverBudget ? 'var(--expense)' : percentUsed > 80 ? '#f59e0b' : 'var(--income)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>{item.icon}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{item.label}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: item.color || 'var(--text-primary)', fontSize: '0.95rem' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px', background: isOverBudget ? 'var(--expense-bg)' : 'var(--income-bg)', borderRadius: 'var(--radius-md)', border: `1px solid ${isOverBudget ? 'rgba(244,63,94,0.2)' : 'rgba(34,197,94,0.2)'}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            {isOverBudget ? <RiAlarmWarningLine color="var(--expense)" size={18} /> : <RiCheckLine color="var(--income)" size={18} />}
            <span style={{ color: isOverBudget ? 'var(--expense)' : 'var(--income)', fontWeight: 600, fontSize: '0.88rem' }}>
              {isOverBudget ? 'You have exceeded your monthly budget!' : 'You are within your budget limit.'}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20 }}>Category Budgets</h3>
        {categoryBreakdown.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px' }}>
            <div className="empty-state-icon">📂</div>
            <h3>No spending this month</h3>
            <p>Your expense categories will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categoryBreakdown.map(({ category, spent, budgeted }) => {
              const catColor = CATEGORY_COLORS[category] || '#9ca3af';
              const isEditing = editingCategory === category;
              const pct = budgeted > 0 ? Math.min((spent / budgeted) * 100, 100) : 0;
              return (
                <div key={category} style={{ padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: budgeted > 0 ? 10 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColor, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>{category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: 'var(--expense)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{format(spent)}</span>
                      {budgeted > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ {format(budgeted)}</span>}
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input className="form-input" type="number" placeholder="Set limit" value={catBudgetValue} onChange={e => setCatBudgetValue(e.target.value)} style={{ width: 110, padding: '5px 10px', fontSize: '0.82rem' }} autoFocus />
                          <button className="btn btn-primary" onClick={() => saveCategoryBudget(category)} style={{ padding: '5px 10px' }}><RiCheckLine size={14} /></button>
                        </div>
                      ) : (
                        <button className="btn btn-secondary" onClick={() => { setEditingCategory(category); setCatBudgetValue(budgeted || ''); }} style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
                          <RiEdit2Line size={12} /> {budgeted ? 'Edit' : 'Set limit'}
                        </button>
                      )}
                    </div>
                  </div>
                  {budgeted > 0 && (
                    <div>
                      <div style={{ height: 6, background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: barColor(pct), borderRadius: 3 }} />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{pct.toFixed(1)}% used</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}