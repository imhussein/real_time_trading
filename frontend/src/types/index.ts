export interface HistoricalPoint {
  ts: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface HistoricalResponse {
  symbol: string;
  data: HistoricalPoint[];
}
