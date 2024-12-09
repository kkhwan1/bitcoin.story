import { WebSocket } from 'ws';
import { sendNotification } from './notificationService.js';

export const startPriceAlerts = (userAlerts) => {
  const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
  
  ws.on('open', () => {
    const symbols = userAlerts.map(alert => alert.symbol);
    const subscription = JSON.stringify([
      { ticket: "PRICE_ALERT" },
      { type: "ticker", codes: symbols }
    ]);
    ws.send(subscription);
  });

  ws.on('message', (data) => {
    const ticker = JSON.parse(data.toString());
    checkAlerts(ticker, userAlerts);
  });
}; 