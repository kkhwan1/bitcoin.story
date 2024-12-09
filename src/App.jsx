import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News';
import Header from './components/layout/Header';
import { FavoriteProvider } from './contexts/FavoriteContext.jsx';
import { BookmarkProvider } from './contexts/BookmarkContext.jsx';
import { CryptoProvider } from './contexts/CryptoContext';

function App() {
  return (
    <FavoriteProvider>
      <CryptoProvider>
        <BookmarkProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
            </Routes>
          </Router>
        </BookmarkProvider>
      </CryptoProvider>
    </FavoriteProvider>
  );
}

export default App; 