import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AuthContext, { AuthProvider } from "./contexts/auth";

import Routes from "./Routes";

export default function App() {
  const isLoggedIn = false;

  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
