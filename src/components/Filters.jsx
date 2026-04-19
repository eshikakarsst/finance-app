import React from 'react';
import { CATEGORIES } from '../utils/currencyFormatter';
import { RiFilterLine, RiRefreshLine } from 'react-icons/ri';

export default function Filters({ filters, setFilters, onReset, sortBy, sortDir, toggleSort }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
        <RiFilterLine size={15} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filters</span>
      </div>
      <div className="form-group" style={{ minWidth: 140, flex: '1 1 140px' }}>
        <label className="form-label">Category</label>
        <select className="form-select" value={filters.category} onChange={e => update('category', e.target.value)} style={{ padding: '8px 32px 8px 10px', fontSize: '0.85rem' }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: '1 1 120px' }}>
        <label className="form-label">Type</label>
        <select className="form-select" value={filters.type} onChange={e => update('type', e.target.value)} style={{ padding: '8px 32px 8px 10px', fontSize: '0.85rem' }}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="form-group" style={{ minWidth: 140, flex: '1 1 140px' }}>
        <label className="form-label">From Date</label>
        <input type="date" className="form-input" value={filters.startDate} onChange={e => update('startDate', e.target.value)} style={{ padding: '8px 10px', fontSize: '0.85rem', colorScheme: 'dark' }} />
      </div>
      <div className="form-group" style={{ minWidth: 140, flex: '1 1 140px' }}>
        <label className="form-label">To Date</label>
        <input type="date" className="form-input" value={filters.endDate} onChange={e => update('endDate', e.target.value)} style={{ padding: '8px 10px', fontSize: '0.85rem', colorScheme: 'dark' }} />
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: '1 1 120px' }}>
        <label className="form-label">Sort By</label>
        <select className="form-select" value={sortBy} onChange={e => toggleSort(e.target.value)} style={{ padding: '8px 32px 8px 10px', fontSize: '0.85rem' }}>
          <option value="date">Date {sortBy === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</option>
          <option value="amount">Amount {sortBy === 'amount' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</option>
          <option value="category">Category {sortBy === 'category' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</option>
        </select>
      </div>
      <button className="btn btn-secondary" onClick={onReset} style={{ padding: '9px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <RiRefreshLine size={14} /> Reset
      </button>
    </div>
  );
}