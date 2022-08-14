import React from "react";
import Login from "../screens/login";
import Register from "../screens/Register";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

// import { Container } from './styles';

const Auth = (): JSX.Element => {
  const Stack = createNativeStackNavigator();

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

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} options={optionsLogin} />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: "Cadastrar" }}
      />
    </Stack.Navigator>
  );
};

export default Auth;
