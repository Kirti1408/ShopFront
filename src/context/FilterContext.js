import React, { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    brands: [],
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ category: '', minPrice: '', maxPrice: '', brands: [] });
    setPage(1);
  }, []);

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters, page, setPage, PAGE_SIZE }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
