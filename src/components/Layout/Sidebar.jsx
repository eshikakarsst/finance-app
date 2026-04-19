import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine, RiExchangeLine, RiAddCircleLine,
  RiPieChartLine, RiBarChartLine, RiMenuFoldLine, RiMenuUnfoldLine,
  RiCurrencyLine, RiCloseLine
} from 'react-icons/ri';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../hooks/useCurrency';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

const NAV_ITEMS = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/transactions', icon: RiExchangeLine, label: 'Transactions' },
  { to: '/transactions/new', icon: RiAddCircleLine, label: 'Add Transaction' },
  { to: '/budget', icon: RiPieChartLine, label: 'Budget' },
  { to: '/analytics', icon: RiBarChartLine, label: 'Analytics' },
  { to: '/currency', icon: RiMoneyDollarCircleLine, label: 'Currency' },
];

export default function Sidebar({ mobileOpen, setMobileOpen, isMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const { getNetBalance, getTotalIncome, getTotalExpenses } = useFinance();
  const { format } = useCurrency();
  const location = useLocation();

  const balance = getNetBalance();
  const isPositive = balance >= 0;

  const isActuallyCollapsed = isMobile ? false : collapsed;

  return (
    <>
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 90, backdropFilter: 'blur(4px)'
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ 
          width: isMobile ? 280 : (collapsed ? 72 : 260),
          x: isMobile ? (mobileOpen ? 0 : -280) : 0
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          height: '100vh',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0, left: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 18,
          }}>
            <RiCurrencyLine color="#fff" />
          </div>
          <AnimatePresence>
            {!isActuallyCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  FinanceIQ
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Personal Finance</div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isMobile ? (
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                marginLeft: 'auto', background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: 24, padding: 4,
                borderRadius: 6, flexShrink: 0, cursor: 'pointer', transition: 'color 0.2s',
              }}
            >
              <RiCloseLine />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{
                marginLeft: 'auto', background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: 18, padding: 4,
                borderRadius: 6, flexShrink: 0, cursor: 'pointer', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
            </button>
          )}
        </div>

        {/* Balance Summary */}
        <AnimatePresence>
          {!isActuallyCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ padding: '16px 16px 8px' }}
            >
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '14px 16px',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Net Balance
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem',
                  color: isPositive ? 'var(--income)' : 'var(--expense)',
                }}>
                  {isPositive ? '+' : '-'}{format(Math.abs(balance))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Income</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--income)', fontWeight: 600 }}>{format(getTotalIncome())}</div>
                  </div>
                  <div style={{ width: 1, background: 'var(--border)' }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Spent</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--expense)', fontWeight: 600 }}>{format(getTotalExpenses())}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <nav style={{ padding: '8px 10px', flex: 1, overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = to === '/transactions'
              ? location.pathname === '/transactions'
              : location.pathname.startsWith(to);
            return (
              <NavLink key={to} to={to}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: isActuallyCollapsed ? '12px' : '11px 14px',
                    borderRadius: 'var(--radius-md)', marginBottom: 4,
                    background: active ? 'var(--accent-glow)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(124,92,252,0.3)' : 'transparent'}`,
                    color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
                    transition: 'var(--transition)',
                    justifyContent: isActuallyCollapsed ? 'center' : 'flex-start',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                >
                  <Icon size={19} style={{ flexShrink: 0 }} />
                  <AnimatePresence>
                    {!isActuallyCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
