import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((coin) => {
    setFavorites(prev => {
      if (!prev.includes(coin)) {
        return [...prev, coin];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((coin) => {
    setFavorites(prev => prev.filter(c => c !== coin));
  }, []);

  const isFavorite = useCallback((coin) => {
    return favorites.includes(coin);
  }, [favorites]);

  const toggleFavorite = (coinSymbol) => {
    if (isFavorite(coinSymbol)) {
      removeFavorite(coinSymbol);
    } else {
      addFavorite(coinSymbol);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
} 