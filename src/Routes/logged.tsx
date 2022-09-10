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
import Profile from "../screens/Profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
        <HomeStack.Screen name="Vehicle" component={Vehicle} />
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
        options={{
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
        }}
        // options={{
        //   title: "Minha Garagem",
        //   tabBarLabel: ({ focused }) => {
        //     return (
        //       <Text style={{ color: focused ? "#473198" : "grey" }}>
        //         Garagem
        //       </Text>
        //     );
        //   },
        //   tabBarIcon: ({ focused }) => (
        //     <MaterialCommunityIcons
        //       name="garage-variant"
        //       size={30}
        //       color={focused ? "#473198" : "grey"}
        //     />
        //   ),
        // }}
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
