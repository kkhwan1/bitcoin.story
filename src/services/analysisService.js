import axios from 'axios';
import regression from 'regression';
import { RSI, MACD, BollingerBands } from 'technicalindicators';
import * as tf from '@tensorflow/tfjs';

export const fetchHistoricalData = async (symbol, interval = 'days') => {
  try {
    const response = await axios.get(`https://api.upbit.com/v1/candles/${interval}`, {
      params: {
        market: `KRW-${symbol}`,
        count: 200
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch historical data:', error);
    return [];
  }
};

export const calculateTechnicalIndicators = (data) => {
  const prices = data.map(candle => candle.trade_price);
  const volumes = data.map(candle => candle.candle_acc_trade_volume);

  // RSI 계산
  const rsiValues = RSI.calculate({
    values: prices,
    period: 14
  });

  // MACD 계산
  const macdValues = MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9
  });

  // 볼린저 밴드 계산
  const bbValues = BollingerBands.calculate({
    values: prices,
    period: 20,
    stdDev: 2
  });

  return {
    rsi: rsiValues,
    macd: macdValues,
    bollingerBands: bbValues
  };
};

export const predictPrice = async (data) => {
  const prices = data.map(candle => candle.trade_price);
  const volumes = data.map(candle => candle.candle_acc_trade_volume);

  // 선형 회귀 분석
  const points = prices.map((price, index) => [index, price]);
  const result = regression.linear(points);
  const linearPrediction = result.predict(points.length + 1)[1];

  // 단순 이동평균
  const ma20 = calculateMA(prices, 20);
  const ma50 = calculateMA(prices, 50);

  // 머신러닝 모델 (간단한 LSTM)
  const model = await createLSTMModel(prices);
  const tensorPrediction = await model.predict(
    tf.tensor2d([prices.slice(-20)], [1, 20, 1])
  ).data();

  return {
    linearPrediction,
    ma20: ma20[ma20.length - 1],
    ma50: ma50[ma50.length - 1],
    mlPrediction: tensorPrediction[0]
  };
};

const calculateMA = (data, period) => {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
};

const createLSTMModel = async (data) => {
  const model = tf.sequential();
  
  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: true,
    inputShape: [20, 1]
  }));
  
  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: false
  }));
  
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError'
  });

  return model;
}; 