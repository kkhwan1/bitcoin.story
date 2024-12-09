import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoriteContextType {
  favorites: string[];
  addFavorite: (coin: string) => void;
  removeFavorite: (coin: string) => void;
  isFavorite: (coin: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | null>(null);

const STORAGE_KEY = 'crypto_favorites';

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (coin: string) => {
    setFavorites(prev => [...new Set([...prev, coin])]);
  };

  const removeFavorite = (coin: string) => {
    setFavorites(prev => prev.filter(c => c !== coin));
  };

  const isFavorite = (coin: string) => favorites.includes(coin);

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}; 