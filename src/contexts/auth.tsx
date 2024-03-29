import React, {
  createContext,
  ReactPortal,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as auth from "../requests/auth";
import { AuthResponse, AuthValues } from "../requests/auth";
import { Alert } from "react-native";
import { api } from "../requests";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signOut(): void;
  signIn: (values: AuthValues) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    const storagedUser = await AsyncStorage.getItem("@RNAuth:user");
    const storagedToken = await AsyncStorage.getItem("@RNAuth:token");

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.common = {
        Authorization: `bearer ${storagedToken}`,
      };
    }

    setLoading(false);
  }

  async function signIn(values: AuthValues) {
    const data = await auth.signIn(values);

    if (!data) {
      return Alert.alert("Falha na autenticação", "Falha ao realizar o login");
    }

    const userFormated: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      createdAt: data.user.createdAt,
    };

    setUser(userFormated);

    api.defaults.headers.common = {
      Authorization: `bearer ${data.access_token}`,
    };

    await AsyncStorage.setItem("@RNAuth:user", JSON.stringify(userFormated));
    await AsyncStorage.setItem("@RNAuth:token", data.access_token);
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

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export { AuthContext, useAuth };
