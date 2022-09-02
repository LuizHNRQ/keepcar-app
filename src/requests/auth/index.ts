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

export async function signIn(
  data: AuthValues
): Promise<AuthResponse | undefined> {
  try {
    const response = await api.post<AuthResponse>("/authenticate", data);

    return response.data;
  } catch (error) {
    console.log("Erro 4432", error);
  }
}
