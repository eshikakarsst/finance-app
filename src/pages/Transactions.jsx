import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import TransactionCard from '../components/TransactionCard';
import AddTransaction from './AddTransaction';
import { RiAddLine } from 'react-icons/ri';

export default function Transactions() {
  const navigate = useNavigate();
  const { transactions, filters, setFilters, searchQuery, setSearchQuery, sortBy, sortDir, toggleSort, resetFilters, allTransactions } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const handleEdit = (transaction) => { setEditingTransaction(transaction); setShowEdit(true); };
  const handleEditClose = () => { setShowEdit(false); setEditingTransaction(null); };

  if (showEdit && editingTransaction) {
    return <AddTransaction editMode transaction={editingTransaction} onClose={handleEditClose} />;
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{allTransactions.length} total · {transactions.length} shown</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/transactions/new')}>
          <RiAddLine size={16} /> Add New
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Filters filters={filters} setFilters={setFilters} onReset={resetFilters} sortBy={sortBy} sortDir={sortDir} toggleSort={toggleSort} />
      </div>
      {transactions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No transactions found</h3>
            <p>Try changing your search or filters</p>
          </div>
        </div>
      ) : (
        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} layout>
          <AnimatePresence>
            {transactions.map(t => <TransactionCard key={t.id} transaction={t} onEdit={handleEdit} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}