import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORY_COLORS } from '../../utils/currencyFormatter';
import { useCurrency } from '../../hooks/useCurrency';

const CustomTooltip = ({ active, payload }) => {
  const { format } = useCurrency();
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: payload[0].payload.fill }}>{payload[0].name}</div>
        <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>{format(payload[0].value)}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{payload[0].payload.percent?.toFixed(1)}% of total</div>
      </div>
    );
  }
  return null;
};

export default function SpendingPieChart({ transactions }) {
  const { getCategorySpending } = useFinance();
  const data = getCategorySpending(transactions).map(item => ({
    ...item, fill: CATEGORY_COLORS[item.name] || '#9ca3af',
  }));
  const total = data.reduce((s, d) => s + d.value, 0);
  const dataWithPercent = data.map(d => ({ ...d, percent: total > 0 ? (d.value / total) * 100 : 0 }));

  if (!data.length) return (
    <div className="empty-state" style={{ padding: '40px 20px' }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>🥧</div>
      <p>No expense data yet</p>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={dataWithPercent} cx="50%" cy="50%" innerRadius={70} outerRadius={105} dataKey="value" paddingAngle={3} strokeWidth={0}>
          {dataWithPercent.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>} iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}