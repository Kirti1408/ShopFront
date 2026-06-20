import { useState, useEffect, useCallback } from 'react';
import { useFilters } from '../context/FilterContext';

const BASE = 'https://dummyjson.com';

export function useProducts() {
  const { filters, page, PAGE_SIZE } = useFilters();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (filters.category) {
        url = `${BASE}/products/category/${encodeURIComponent(filters.category)}?limit=200&skip=0`;
      } else {
        url = `${BASE}/products?limit=200&skip=0`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setAllProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filters.category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side filtering
  const filtered = allProducts.filter(p => {
    const min = filters.minPrice !== '' ? parseFloat(filters.minPrice) : null;
    const max = filters.maxPrice !== '' ? parseFloat(filters.maxPrice) : null;
    if (min !== null && p.price < min) return false;
    if (max !== null && p.price > max) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    return true;
  });

  // Unique brands from current category fetch
  const availableBrands = [...new Set(
    allProducts.map(p => p.brand).filter(Boolean)
  )].sort();

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { products: paginated, allFiltered: filtered, loading, error, totalPages, availableBrands, retry: fetchProducts };
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error(`Product not found (${res.status})`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/products/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}
