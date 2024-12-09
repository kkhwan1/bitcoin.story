import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  // localStorage에서 즐겨찾기 데이터 불러오기
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  // 즐겨찾기 변경시 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  // 즐겨찾기 추가
  const addFavorite = (coinSymbol) => {
    setFavorites(prev => {
      if (!prev.includes(coinSymbol)) {
        return [...prev, coinSymbol];
      }
      return prev;
    });
  };

  // 즐겨찾기 제거
  const removeFavorite = (coinSymbol) => {
    setFavorites(prev => prev.filter(symbol => symbol !== coinSymbol));
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (coinSymbol) => {
    return favorites.includes(coinSymbol);
  };

  // 즐겨찾기 토글
  const toggleFavorite = (coinSymbol) => {
    if (isFavorite(coinSymbol)) {
      removeFavorite(coinSymbol);
    } else {
      addFavorite(coinSymbol);
    }
  };

  return (
    <FavoriteContext.Provider 
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        isFavorite, 
        toggleFavorite 
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

// 커스텀 훅
export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
} 