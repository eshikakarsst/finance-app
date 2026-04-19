import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthlyData } from '../../utils/currencyFormatter';
import { useCurrency } from '../../hooks/useCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  const { format } = useCurrency();
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, fontSize: '0.85rem', fontWeight: 600 }}>{p.name}: {format(p.value)}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MonthlyTrendChart({ transactions }) {
  const data = getMonthlyData(transactions);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={50} tickFormatter={v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{v}</span>} />
        <Line type="monotone" dataKey="income" name="Income" stroke="var(--income)" strokeWidth={2.5} dot={{ fill: 'var(--income)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="var(--expense)" strokeWidth={2.5} dot={{ fill: 'var(--expense)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}