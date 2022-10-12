import React from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";

// import { Container } from './styles';

const Profile: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: "#c43d3d" }}
        onPress={signOut}
      >
        <Text style={{ marginRight: 10, color: "white" }}>Deslogar</Text>
        <MaterialIcons name="logout" size={24} color="white" />
      </TouchableOpacity>
      {/* <Text>Profile Screen</Text> */}
      {/* <Button title="sair" onPress={signOut}></Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    width: "80%",
  },
});

export default Profile;
