import React from 'react';
import { useFilters } from '../context/FilterContext';
import styles from './Pagination.module.css';

export default function Pagination({ totalPages }) {
  const { page, setPage } = useFilters();

  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button className={styles.arrow} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">←</button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
        ) : (
          <button key={p} className={`${styles.btn} ${p === page ? styles.active : ''}`} onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined}>{p}</button>
        )
      )}
      <button className={styles.arrow} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">→</button>
    </nav>
  );
}