import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RiEditLine, RiDeleteBinLine, RiRepeatLine } from 'react-icons/ri';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../hooks/useCurrency';
import { CATEGORY_COLORS, formatDate } from '../utils/currencyFormatter';
import { toast } from 'react-toastify';

export default function TransactionCard({ transaction, onEdit }) {
  const { deleteTransaction } = useFinance();
  const { format } = useCurrency();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      deleteTransaction(transaction.id);
      toast.success('Transaction deleted');
    }, 300);
  };

  const catColor = CATEGORY_COLORS[transaction.category] || '#9ca3af';
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: deleting ? 0 : 1, y: deleting ? -10 : 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: catColor + '20', border: `1px solid ${catColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {transaction.title}
          </span>
          {transaction.recurring && (
            <span className="badge badge-recurring" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
              <RiRepeatLine size={10} /> Recurring
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: catColor, fontWeight: 500 }}>{transaction.category}</span>
          <span style={{ color: 'var(--border)', fontSize: '0.75rem' }}>•</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(transaction.date)}</span>
          {transaction.notes && (
            <>
              <span style={{ color: 'var(--border)', fontSize: '0.75rem' }}>•</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{transaction.notes}</span>
            </>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: isIncome ? 'var(--income)' : 'var(--expense)' }}>
          {isIncome ? '+' : '-'}{format(transaction.amount)}
        </div>
        <div className={`badge badge-${transaction.type}`} style={{ fontSize: '0.68rem', marginTop: 4 }}>
          {transaction.type}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button className="btn btn-secondary" onClick={() => onEdit(transaction)} style={{ padding: '6px 8px', fontSize: '0.8rem', borderRadius: 8 }}>
          <RiEditLine size={14} />
        </button>
        <button className="btn btn-danger" onClick={handleDelete} style={{ padding: '6px 8px', fontSize: '0.8rem', borderRadius: 8 }}>
          <RiDeleteBinLine size={14} />
        </button>
      </div>
    </motion.div>
  );
}