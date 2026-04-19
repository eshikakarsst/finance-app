import React from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

export default function SearchBar({ value, onChange, placeholder = 'Search transactions…' }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <RiSearchLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      <input
        className="form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: 40, paddingRight: value ? 38 : 14 }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 2, borderRadius: 4 }}>
          <RiCloseLine size={16} />
        </button>
      )}
    </div>
  );
}