import axios from 'axios';
import WebSocket from 'ws';

export const getMarketData = async () => {
  try {
    const response = await axios.get('https://api.upbit.com/v1/market/all');
    return response.data.filter(market => market.market.startsWith('KRW-'));
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error;
  }
};

export const getCoinPrice = async (symbol) => {
  try {
    const response = await axios.get(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`);
    return response.data[0];
  } catch (error) {
    console.error('Failed to fetch coin price:', error);
    throw error;
  }
};

export const getOrderBook = async (symbol) => {
  try {
    const response = await axios.get(`https://api.upbit.com/v1/orderbook?markets=KRW-${symbol}`);
    return response.data[0];
  } catch (error) {
    console.error('Failed to fetch orderbook:', error);
    throw error;
  }
}; 