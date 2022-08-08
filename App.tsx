import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./screens/login";
import Register from "./screens/Register";
import Dashboard from "./screens/dashboard";
import Help from "./screens/Help";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const optionsLogin: NativeStackNavigationOptions = {
  title: "Login",
  headerStyle: {
    backgroundColor: "#f4511e",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

export default function App() {
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      ) : (
        // Auth screens
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} options={optionsLogin} />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ title: "Cadastrar" }}
          />
        </Stack.Navigator>
      )}
      {/* Common modal screens */}
    </NavigationContainer>
  );
}
