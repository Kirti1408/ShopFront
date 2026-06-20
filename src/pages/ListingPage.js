import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import { useProducts } from '../hooks/useProducts';
import { useFilters } from '../context/FilterContext';
import styles from './ListingPage.module.css';

export default function ListingPage() {
  const { products, allFiltered, loading, error, totalPages, availableBrands, retry } = useProducts();
  const { filters, page } = useFilters();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const activeFilterCount = [
    filters.category,
    filters.minPrice || filters.maxPrice,
    filters.brands.length > 0,
  ].filter(Boolean).length;

  return (
    <div className={styles.layout}>
      <FilterPanel
        availableBrands={availableBrands}
        totalCount={loading ? null : allFiltered.length}
        mobileOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />

      <main className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setMobileFilterOpen(true)}
            aria-label="Open filters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="20" y2="12"/>
              <line x1="12" y1="18" x2="20" y2="18"/>
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>

          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbHome}>All Products</span>
            {filters.category && (
              <>
                <span className={styles.breadcrumbSep}>/</span>
                <span className={styles.breadcrumbCat}>
                  {filters.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </>
            )}
          </div>

          {!loading && (
            <span className={styles.countLabel}>
              {allFiltered.length} result{allFiltered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className={styles.errorBox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p className={styles.errorTitle}>Failed to load products</p>
              <p className={styles.errorMsg}>{error}</p>
            </div>
            <button className={styles.retryBtn} onClick={retry}>Retry</button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <>
            <div className={styles.grid}>
              {loading
                ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
                : products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>

            {/* Empty state */}
            {!loading && products.length === 0 && (
              <div className={styles.empty}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <h3 className={styles.emptyTitle}>No products found</h3>
                <p className={styles.emptyMsg}>Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}

            {!loading && <Pagination totalPages={totalPages} />}
          </>
        )}
      </main>
    </div>
  );
}
