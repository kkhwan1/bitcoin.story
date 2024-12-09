export interface MarketData {
  market: string;
  korean_name: string;
  trade_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
  high_price: number;
  low_price: number;
  timestamp: number;
}

export interface CoinInfo {
  symbol: string;
  name: string;
  market: string;
}

export interface WebSocketMessage {
  type: string;
  code: string;
  trade_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
  timestamp: number;
}

export interface CryptoContextValue {
  marketData: MarketData[];
  selectedCoin: string;
  setSelectedCoin: (coin: string) => void;
  availableCoins: CoinInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export interface WebSocketManagerConfig {
  url: string;
  onMessage: (event: MessageEvent) => void;
  onError: (error: Error) => void;
} 