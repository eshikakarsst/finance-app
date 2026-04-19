import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        <Outlet />
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