import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosResponse, CanceledError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../requests";
import { AuthResponse, AuthValues } from "../../requests/auth";

// userAction.js
export const registerUser: any = createAsyncThunk(
  // action type string
  "user/register",
  // callback function
  async ({ firstName, email, password }: any, { rejectWithValue }: any) => {
    try {
      // make request to backend
      await api.post("/api/user/register", { firstName, email, password });
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }: AuthValues, { rejectWithValue }: any) => {
    try {
      const { data }: AxiosResponse<AuthResponse> = await api.post(
        `/authenticate`,
        { email, password }
      );

      console.log("fez login", data);
      // store user's token in local storage
      //   localStorage.setItem("userToken", data.userToken);

      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem("@auth_user", jsonValue);
      return data;
    } catch (error: any) {
      console.log("error aqui 1123", error);

      if (axios.isAxiosError(error)) {
        console.log("error123", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);
