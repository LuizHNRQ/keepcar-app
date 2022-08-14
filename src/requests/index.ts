import axios from "axios";

export type ValuesToLogin = {
  email: string;
  password: string;
};

export const api = axios.create({
  baseURL: "http://localhost:3333",
});
