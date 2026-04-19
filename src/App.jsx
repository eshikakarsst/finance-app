import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import CurrencyExchange from './components/CurrencyExchange';

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/new" element={<AddTransaction />} />
            <Route path="budget" element={<Budget />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="currency" element={
              <div className="page-container">
                <div className="page-header">
                  <h1 className="page-title">Currency Exchange</h1>
                  <p className="page-subtitle">Live currency conversion rates</p>
                </div>
                <div style={{ maxWidth: 520 }}>
                  <CurrencyExchange />
                </div>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}