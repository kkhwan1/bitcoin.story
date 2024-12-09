import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CoinDetail from '../pages/CoinDetail';
import TradingViewWidget from '../components/chart/TradingViewWidget';
import Community from '../pages/Community';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coin/:symbol" element={<CoinDetail />} />
      <Route path="/chart" element={<TradingViewWidget />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/:coinSymbol" element={<Community />} />
    </Routes>
  );
}

export default AppRoutes; 