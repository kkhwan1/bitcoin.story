import React, { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const savedBookmarks = localStorage.getItem('bookmarks');
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, [bookmarks]);

  const addBookmark = (item) => {
    setBookmarks(prev => {
      if (!prev.some(bookmark => bookmark.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeBookmark = (itemId) => {
    setBookmarks(prev => prev.filter(item => item.id !== itemId));
  };

  const isBookmarked = (itemId) => {
    return bookmarks.some(item => item.id === itemId);
  };

  const toggleBookmark = (item) => {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark(item);
    }
  };

  return (
    <BookmarkContext.Provider 
      value={{ 
        bookmarks, 
        addBookmark, 
        removeBookmark, 
        isBookmarked, 
        toggleBookmark 
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
} 