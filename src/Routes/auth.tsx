import React from "react";
import Login from "../screens/Login";
import Register from "../screens/Register";
import KeepCar from "../screens/KeepCarId";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import VehicleShow from "../screens/VehicleVisualization";

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
      <Stack.Screen
        name="KeepCarId"
        component={KeepCar}
        options={{ title: "Visualizar veículo", headerShown: true }}
      />
      <Stack.Screen
        name="VehicleShow"
        options={{
          title: "Detalhes",
          headerShown: true,
        }}
        component={VehicleShow}
      />
    </Stack.Navigator>
  );
};

export default Auth;
