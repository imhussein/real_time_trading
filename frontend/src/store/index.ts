import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import marketReducer from "./reducers/marketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
