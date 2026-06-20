import React from 'react';

export default function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div className="skeleton" style={{ width: '100%', paddingTop: '72%' }} />
      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 11, width: '40%' }} />
        <div className="skeleton" style={{ height: 14, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        <div className="skeleton" style={{ height: 12, width: '55%', marginTop: 2 }} />
        <div className="skeleton" style={{ height: 18, width: '35%', marginTop: 4 }} />
      </div>
    </div>
  );
}