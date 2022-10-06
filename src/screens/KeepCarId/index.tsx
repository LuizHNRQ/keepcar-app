import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../contexts/auth";

// import { Container } from './styles';

const KeepCar = ({ navigation }: any) => {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {!!!user && (
        <Button
          title="Voltar para login"
          onPress={() => navigation.navigate("Login")}
        />
      )}
    </View>
  );
};

export default KeepCar;
