import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchCategories } from '../hooks/useProducts';
import styles from './FilterPanel.module.css';

function slugToLabel(slug) {
  if (!slug) return '';
  return slug
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function FilterPanel({ availableBrands, totalCount, mobileOpen, onClose }) {
  const { filters, updateFilter, resetFilters } = useFilters();
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [minInput, setMinInput] = useState(filters.minPrice);
  const [maxInput, setMaxInput] = useState(filters.maxPrice);

  useEffect(() => {
    fetchCategories()
      .then(data => {
        // dummyjson v2 returns array of objects with slug/name, or strings
        const cats = Array.isArray(data)
          ? data.map(c => (typeof c === 'string' ? { slug: c, name: slugToLabel(c) } : { slug: c.slug, name: c.name || slugToLabel(c.slug) }))
          : [];
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setCatLoading(false));
  }, []);

  // Sync price inputs when filters reset
  useEffect(() => {
    setMinInput(filters.minPrice);
    setMaxInput(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  function handlePriceApply() {
    updateFilter('minPrice', minInput);
    updateFilter('maxPrice', maxInput);
  }

  function handleBrandToggle(brand) {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    updateFilter('brands', next);
  }

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.brands.length > 0;

  return (
    <>
      {mobileOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.panel} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <span className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span>ShopFront</span>
          </span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close filters">✕</button>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.filterHeader}>
            <span className={styles.filterTitle}>Filters</span>
            {hasActiveFilters && (
              <button className={styles.clearAll} onClick={resetFilters}>Clear all</button>
            )}
          </div>

          {totalCount != null && (
            <p className={styles.resultCount}>{totalCount} product{totalCount !== 1 ? 's' : ''}</p>
          )}

          {/* Category */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Category</h3>
            {catLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 16, width: `${60 + Math.random() * 30}%` }} />
                ))}
              </div>
            ) : (
              <div className={styles.catList}>
                <button
                  className={`${styles.catItem} ${!filters.category ? styles.catActive : ''}`}
                  onClick={() => updateFilter('category', '')}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    className={`${styles.catItem} ${filters.category === cat.slug ? styles.catActive : ''}`}
                    onClick={() => updateFilter('category', cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Price Range */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Price Range</h3>
            <div className={styles.priceRow}>
              <div className={styles.priceField}>
                <label className={styles.priceLabel}>Min $</label>
                <input
                  type="number"
                  className={styles.priceInput}
                  placeholder="0"
                  value={minInput}
                  min="0"
                  onChange={e => setMinInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePriceApply()}
                />
              </div>
              <div className={styles.priceSep}>—</div>
              <div className={styles.priceField}>
                <label className={styles.priceLabel}>Max $</label>
                <input
                  type="number"
                  className={styles.priceInput}
                  placeholder="∞"
                  value={maxInput}
                  min="0"
                  onChange={e => setMaxInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePriceApply()}
                />
              </div>
            </div>
            <button className={styles.applyBtn} onClick={handlePriceApply}>Apply Price</button>
          </section>

          {/* Brand */}
          {availableBrands.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Brand</h3>
              <div className={styles.brandList}>
                {availableBrands.map(brand => (
                  <label key={brand} className={styles.brandItem}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <span className={styles.brandLabel}>{brand}</span>
                  </label>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
