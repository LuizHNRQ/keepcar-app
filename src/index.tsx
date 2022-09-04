import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AuthContext, { AuthProvider } from "./contexts/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Routes from "./Routes";

export default function App() {
  const isLoggedIn = false;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
