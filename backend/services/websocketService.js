import WebSocket from 'ws';
import { Server } from 'http';

export const initializeWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleWebSocketMessage(ws, data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};

const handleWebSocketMessage = (ws, data) => {
  switch (data.type) {
    case 'subscribe':
      handleSubscription(ws, data);
      break;
    case 'unsubscribe':
      handleUnsubscription(ws, data);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
};

const handleSubscription = (ws, data) => {
  // 업비트 WebSocket 연결 및 데이터 구독 처리
  const upbitWs = new WebSocket('wss://api.upbit.com/websocket/v1');
  
  upbitWs.on('open', () => {
    const subscribeMessage = [
      { ticket: "UNIQUE_TICKET" },
      { 
        type: data.dataType || "ticker",
        codes: data.symbols || ["KRW-BTC"]
      }
    ];
    upbitWs.send(JSON.stringify(subscribeMessage));
  });

  upbitWs.on('message', (data) => {
    ws.send(data);
  });

  ws.upbitWs = upbitWs; // WebSocket 인스턴스 저장
};

const handleUnsubscription = (ws) => {
  if (ws.upbitWs) {
    ws.upbitWs.close();
    delete ws.upbitWs;
  }
}; 