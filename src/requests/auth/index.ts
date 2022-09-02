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
