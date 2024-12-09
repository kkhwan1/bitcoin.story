import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const newsService = {
  async getNews() {
    try {
      const response = await fetch(`${API_URL}/news`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  async getNewsById(id) {
    try {
      const response = await fetch(`${API_URL}/news/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news detail');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching news detail:', error);
      throw error;
    }
  }
}; 