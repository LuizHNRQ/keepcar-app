import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import Dashboard from "../screens/dashboard";
import Garage from "../screens/Garage";
import Vehicle from "../screens/Vehicle";
import NewVehicle from "../screens/NewVehicle";
import TimeLineEvent from "../screens/TimeLineEvent";
import Profile from "../screens/Profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Logged: React.FC = () => {
  const Tab = createBottomTabNavigator();
  const insets = useSafeAreaInsets();

  const HomeStack = createNativeStackNavigator();

  function VehicleStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          name="Garage"
          component={Garage}
          options={{
            title: "Garagem",
          }}
        />
        <HomeStack.Screen
          name="Vehicle"
          options={{
            title: "Detalhes",
          }}
          component={Vehicle}
        />
        <HomeStack.Screen
          name="NewVehicle"
          options={{
            title: "Veículo",
          }}
          component={NewVehicle}
        />
        <HomeStack.Screen
          name="timelineEvent"
          options={{
            title: "Registro",
          }}
          component={TimeLineEvent}
        />
      </HomeStack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 55 + insets.bottom },
      }}
    >
      <Tab.Screen
        name="Events"
        component={Dashboard}
        options={{
          title: "Últimos Eventos",
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={{ color: focused ? "#473198" : "grey" }}>
                Eventos
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="event-note"
              size={26}
              color={focused ? "#473198" : "grey"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="GarageStack"
        component={VehicleStackScreen}
        options={({ route }) => ({
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={{ color: focused ? "#473198" : "grey" }}>
                Garagem
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="garage-variant"
              size={30}
              color={focused ? "#473198" : "grey"}
            />
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            //console.log(routeName);
            if (
              routeName === "timelineEvent" ||
              routeName === "Vehicle" ||
              routeName === "newVehicle"
            ) {
              return { display: "none" };
            }
            return;
          })(route),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Meu Perfil",
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={{ color: focused ? "#473198" : "grey" }}>
                Perfil
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user-circle-o"
              size={24}
              color={focused ? "#473198" : "grey"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Logged;
