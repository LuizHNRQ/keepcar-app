import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../contexts/auth";

// import { Container } from './styles';

const Profile: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>
      <Button title="sair" onPress={signOut}></Button>
    </View>
  );
};

export default Profile;
