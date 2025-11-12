import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token?: string;
  user?: string;
}

const initialState: AuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | undefined>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<string | undefined>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = undefined;
      state.user = undefined;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
