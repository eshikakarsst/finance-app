import React from 'react';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';
import { RiAlarmWarningLine } from 'react-icons/ri';

export default function BudgetCard() {
  const { currentMonthExpenses, remaining, percentUsed, isOverBudget, budget, currentMonth } = useBudget();
  const { format } = useCurrency();
  const barColor = isOverBudget ? 'var(--expense)' : percentUsed > 80 ? '#f59e0b' : 'var(--accent)';

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {isOverBudget && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--expense)' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Monthly Budget</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: 4 }}>{format(budget.monthlyBudget)}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{currentMonth}</div>
        </div>
        {isOverBudget && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--expense-bg)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '6px 10px', color: 'var(--expense)', fontSize: '0.78rem', fontWeight: 600 }}>
            <RiAlarmWarningLine size={14} /> Over Budget!
          </div>
        )}
      </div>
      <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ height: '100%', width: `${percentUsed}%`, background: barColor, borderRadius: 4, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Spent</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: isOverBudget ? 'var(--expense)' : 'var(--text-primary)' }}>{format(currentMonthExpenses)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Used</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: barColor }}>{percentUsed.toFixed(1)}%</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Remaining</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: remaining >= 0 ? 'var(--income)' : 'var(--expense)' }}>
            {remaining >= 0 ? '' : '-'}{format(Math.abs(remaining))}
          </div>
        </div>
      </div>
    </div>
  );
}