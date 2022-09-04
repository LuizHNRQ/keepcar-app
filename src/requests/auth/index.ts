import { AxiosResponse } from "axios";
import { api } from "..";

export type AuthResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
  access_token: string;
};

export type AuthValues = {
  email: string;
  password: string;
};

interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

// export async function signIn(data: AuthValues): Promise<AuthResponse> {
//   try {
//     const response = await api.post<AuthResponse>("/authenticate", data);

//     return response.data;
//   } catch (error) {
//     console.log("Erro 4432", error);
//   }
// }

export const signIn = async (values: AuthValues) => {
  try {
    const { data } = await api.post<AuthValues, AxiosResponse<AuthResponse>>(
      "/authenticate",
      values
    );
    return data;
  } catch (error) {
    console.log("error 1233", error);
  }
};
