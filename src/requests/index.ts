import axios from "axios";

export const apiUrl = "http://127.0.0.1:3333";

export const api = axios.create({
  baseURL: apiUrl,
});
