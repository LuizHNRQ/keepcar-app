import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import AuthContext from "../../contexts/auth";

// import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useContext(AuthContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Garage Screen</Text>
      <Button title="sair" onPress={signOut}></Button>
    </View>
  );
};

export default Dashboard;
