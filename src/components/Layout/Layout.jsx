import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiMenuLine } from 'react-icons/ri';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} isMobile={isMobile} />
      <main style={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {isMobile && (
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid var(--border)', 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--bg-card)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}>
            <button 
              onClick={() => setMobileOpen(true)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-primary)',
                fontSize: 24, display: 'flex', alignItems: 'center', cursor: 'pointer'
              }}
            >
              <RiMenuLine />
            </button>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginLeft: 12, fontSize: '1.1rem' }}>
              FinanceIQ
            </div>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-body)',
          color: 'var(--text-primary)',
        }}
      />
    </div>
  );
}