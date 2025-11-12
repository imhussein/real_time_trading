import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface PriceMap {
  [symbol: string]: { price: number; ts: number };
}

interface MarketState {
  tickers: string[];
  prices: PriceMap;
  selected?: string;
}

const initialState: MarketState = { tickers: [], prices: {} };

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setTickers(state, action: PayloadAction<string[]>) {
      state.tickers = action.payload;
    },
    updatePrices(state, action: PayloadAction<PriceMap>) {
      Object.assign(state.prices, action.payload);
    },
    selectTicker(state, action: PayloadAction<string>) {
      state.selected = action.payload;
    },
  },
});

export const { setTickers, updatePrices, selectTicker } = marketSlice.actions;
export default marketSlice.reducer;
