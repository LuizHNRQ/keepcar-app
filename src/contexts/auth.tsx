import React, { createContext, ReactPortal, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as auth from "../requests/auth";
import { AuthValues } from "../requests/auth";

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn(data: AuthValues): Promise<void>;
  signOut(): void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<object | null>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  });

  async function loadStorageData() {
    const storagedUser = await AsyncStorage.getItem("@RNAuth:user");
    const storagedToken = await AsyncStorage.getItem("@RNAuth:token");

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }

  async function signIn(data: AuthValues) {
    const response = await auth.signIn(data);
    if (!response) {
      return;
    }
    setUser(response.user);

    await AsyncStorage.setItem("@RNAuth:user", JSON.stringify(response.user));
    await AsyncStorage.setItem("@RNAuth:token", response.access_token);
  }

  async function signOut() {
    await AsyncStorage.multiRemove(["@RNAuth:token", "@RNAuth:user"]);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
