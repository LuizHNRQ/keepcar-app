import React from "react";
import { View, Text, Button } from "react-native";

// import { Container } from './styles';

const Register: React.FC = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Register Screen</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};

export default Register;
