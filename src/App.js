import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import ListingPage from './pages/ListingPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route path="/" element={<ListingPage />} />
          <Route path="/product/:id" element={<DetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
