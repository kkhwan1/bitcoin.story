import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Community from './pages/Community';
import CoinDetail from './pages/CoinDetail';
import NewsPage from './pages/NewsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/community" element={<Community />} />
      <Route path="/coin/:symbol" element={<CoinDetail />} />
    </Routes>
  );
}

export default AppRoutes; 