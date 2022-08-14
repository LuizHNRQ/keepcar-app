import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: Number;
  name: String;
  email: String;
  createdAt: String;
};

export interface AuthState {
  user: User;
  token: string;
}

const initialState: AuthState = {
  user: {
    id: 0,
    name: "",
    email: "",
    createdAt: "",
  },
  token: "",
};

export const counterSlice = createSlice({
  name: "authorizer",
  initialState,
  reducers: {
    login: (state: AuthState) => {
      return state;
    },
    logout: (state: AuthState) => {
      return (state = initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = counterSlice.actions;

export default counterSlice.reducer;
