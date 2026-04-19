import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES } from '../utils/currencyFormatter';
import { format } from 'date-fns';
import { RiArrowLeftLine, RiSaveLine, RiRepeatLine } from 'react-icons/ri';

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Min 2 characters'),
  amount: yup.number().typeError('Must be a number').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date: yup.string().required('Date is required'),
  notes: yup.string(),
  recurring: yup.boolean(),
});

export default function AddTransaction({ editMode = false, transaction = null, onClose }) {
  const navigate = useNavigate();
  const { addTransaction, updateTransaction } = useFinance();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editMode && transaction ? {
      title: transaction.title, amount: transaction.amount, category: transaction.category,
      type: transaction.type, date: transaction.date, notes: transaction.notes || '', recurring: transaction.recurring || false,
    } : { type: 'expense', date: format(new Date(), 'yyyy-MM-dd'), recurring: false },
  });

  const selectedType = watch('type');

  const onSubmit = async (data) => {
    if (editMode && transaction) {
      updateTransaction(transaction.id, data);
      toast.success('Transaction updated!');
      onClose?.();
    } else {
      addTransaction(data);
      toast.success('Transaction added!');
      navigate('/transactions');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => onClose ? onClose() : navigate(-1)} style={{ marginBottom: 16, padding: '8px 14px' }}>
          <RiArrowLeftLine size={15} /> Back
        </button>
        <h1 className="page-title">{editMode ? 'Edit Transaction' : 'Add Transaction'}</h1>
        <p className="page-subtitle">{editMode ? 'Update transaction details' : 'Record a new income or expense'}</p>
      </div>
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['income', 'expense'].map(t => (
                <label key={t} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: `1px solid ${selectedType === t ? (t === 'income' ? 'rgba(34,197,94,0.4)' : 'rgba(244,63,94,0.4)') : 'var(--border)'}`, background: selectedType === t ? (t === 'income' ? 'var(--income-bg)' : 'var(--expense-bg)') : 'var(--bg-input)', transition: 'var(--transition)' }}>
                  <input type="radio" value={t} {...register('type')} style={{ display: 'none' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: selectedType === t ? (t === 'income' ? 'var(--income)' : 'var(--expense)') : 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {t === 'income' ? '↑ Income' : '↓ Expense'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="e.g., Grocery Shopping" {...register('title')} />
            {errors.title && <span className="form-error">{errors.title.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input className="form-input" type="number" step="0.01" placeholder="0.00" {...register('amount')} />
            {errors.amount && <span className="form-error">{errors.amount.message}</span>}
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" {...register('category')}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="form-error">{errors.category.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" {...register('date')} style={{ colorScheme: 'dark' }} />
              {errors.date && <span className="form-error">{errors.date.message}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" rows={3} placeholder="Optional notes…" {...register('notes')} style={{ resize: 'vertical', minHeight: 80 }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <input type="checkbox" {...register('recurring')} style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>
                <RiRepeatLine size={15} color="var(--accent-light)" /> Mark as Recurring
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>e.g. Rent, subscriptions, salary</div>
            </div>
          </label>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ padding: '13px 24px', justifyContent: 'center', fontSize: '0.95rem', marginTop: 4 }}>
            <RiSaveLine size={17} />
            {isSubmitting ? 'Saving…' : editMode ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}