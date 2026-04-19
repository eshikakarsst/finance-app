import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiExchangeLine, RiRefreshLine, RiArrowUpDownLine } from 'react-icons/ri';
import { useFinance } from '../context/FinanceContext';
import { fetchExchangeRates } from '../services/api';
import { CURRENCIES } from '../utils/currencyFormatter';

export default function CurrencyExchange() {
  const { exchangeRates, setExchangeRates, ratesLoading, setRatesLoading } = useFinance();
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRates();
  }, []);

  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      convert();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const loadRates = async () => {
    setRatesLoading(true);
    setError(null);
    try {
      const rates = await fetchExchangeRates('INR');
      setExchangeRates(rates);
      setLastUpdated(new Date());
    } catch {
      setError('Failed to fetch rates. Using fallback rates.');
      setExchangeRates({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8 });
    } finally {
      setRatesLoading(false);
    }
  };

  const convert = () => {
    if (!amount || isNaN(amount) || Object.keys(exchangeRates).length === 0) {
      setResult(null);
      return;
    }
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    const inINR = Number(amount) / fromRate;
    const converted = inINR * toRate;
    setResult(converted);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencySymbol = (code) =>
    CURRENCIES.find(c => c.code === code)?.symbol || code;

  const formatResult = (value, code) => {
    if (value === null) return '—';
    return getCurrencySymbol(code) + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const popularPairs = [
    { from: 'INR', to: 'USD' },
    { from: 'INR', to: 'EUR' },
    { from: 'INR', to: 'GBP' },
    { from: 'INR', to: 'JPY' },
  ];

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-glow)', border: '1px solid rgba(124,92,252,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiExchangeLine size={18} color="var(--accent-light)" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Currency Exchange</h3>
            {lastUpdated && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={loadRates}
          disabled={ratesLoading}
          style={{ padding: '7px 12px', fontSize: '0.82rem' }}
        >
          <RiRefreshLine size={14} style={{ animation: ratesLoading ? 'spin 0.7s linear infinite' : 'none' }} />
          {ratesLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--expense-bg)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.82rem', color: 'var(--expense)', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Amount Input */}
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="form-label">Amount</label>
        <input
          className="form-input"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}
        />
      </div>

      {/* Currency Selectors */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 20 }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">From</label>
          <select className="form-select" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={swapCurrencies}
          style={{ padding: '11px 12px', background: 'var(--accent-glow)', border: '1px solid rgba(124,92,252,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-light)', cursor: 'pointer', flexShrink: 0, transition: 'var(--transition)', marginBottom: 1 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-glow)'}
          title="Swap currencies"
        >
          <RiArrowUpDownLine size={17} />
        </button>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">To</label>
          <select className="form-select" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      <motion.div
        key={result}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', textAlign: 'center', marginBottom: 20 }}
      >
        {ratesLoading ? (
          <div className="loading-spinner" style={{ padding: '16px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {formatResult(Number(amount), fromCurrency)} equals
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--accent-light)', lineHeight: 1 }}>
              {formatResult(result, toCurrency)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
              1 {fromCurrency} = {formatResult(
                (exchangeRates[toCurrency] || 1) / (exchangeRates[fromCurrency] || 1),
                toCurrency
              )}
            </div>
          </>
        )}
      </motion.div>

      {/* Popular Pairs */}
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 10 }}>
          Quick Rates (per 1 INR)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {popularPairs.map(({ from, to }) => {
            const rate = (exchangeRates[to] || 1) / (exchangeRates[from] || 1);
            return (
              <button
                key={`${from}-${to}`}
                onClick={() => { setFromCurrency(from); setToCurrency(to); }}
                style={{ background: fromCurrency === from && toCurrency === to ? 'var(--accent-glow)' : 'var(--bg-input)', border: `1px solid ${fromCurrency === from && toCurrency === to ? 'rgba(124,92,252,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '10px 14px', cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left' }}
                onMouseEnter={e => { if (!(fromCurrency === from && toCurrency === to)) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { if (!(fromCurrency === from && toCurrency === to)) e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 2 }}>
                  {from} → {to}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {getCurrencySymbol(to)}{rate.toFixed(4)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}