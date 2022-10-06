import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../contexts/auth";

const Profile = ({ route, navigation }: any) => {
  const { vehicleDetails } = route?.params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>
      <Text>{JSON.stringify(vehicleDetails)}</Text>
      <Text>oi</Text>
    </View>
  );
};

export default Profile;
