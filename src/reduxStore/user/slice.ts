import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { registerUser, userLogin } from "./action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "../../requests/auth";

type UserInfo = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

type UserState = {
  loading: boolean;
  userInfo: UserInfo;
  userToken: string;
  error: string;
  success: boolean;
};

// initialize userToken from local storage
// const userToken = await AsyncStorage.getItem("userToken")
//   ? localStorage.getItem("userToken")
//   : null;

const initialState: UserState = {
  loading: false,
  userInfo: {
    createdAt: "",
    email: "",
    id: 0,
    name: "",
  },
  userToken: "",
  error: "",
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      console.log("pend1");
      state.loading = true;
      state.error = "";
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      console.log("ful fil");
      state.loading = false;
      state.userInfo = {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        createdAt: payload.user.createdAt,
      };
      state.userToken = payload.access_token;
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      console.log("ALLEXIN PASSOU AQUI");
      state.loading = false;
      state.error = payload as any;
    });
  },
});
export default userSlice.reducer;
