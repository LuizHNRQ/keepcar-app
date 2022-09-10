import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AuthProvider } from "./contexts/auth";
import { VehicleProvider } from "./contexts/vehicles";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Routes from "./Routes";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <VehicleProvider>
            <Routes />
          </VehicleProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
