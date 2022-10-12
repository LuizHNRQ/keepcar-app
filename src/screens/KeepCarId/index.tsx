import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../contexts/auth";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { fetchByKeepCarId } from "../../requests/share";

// import { Container } from './styles';

const KeepCar = ({ navigation }: any) => {
  const { user } = useAuth();
  const [keepId, setKeepId] = useState("6NH9UW");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    console.log("kepCard id->", keepId?.toUpperCase());

    try {
      setLoading(true);
      await setTimeout(async () => {
        const { vehicleId } = await fetchByKeepCarId(keepId?.toUpperCase());

        console.log("res11->", vehicleId);

        if (vehicleId) {
          navigation.navigate("VehicleShow", {
            vehicleId,
          });
        }

        setLoading(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      console.log("erro do try 2344", error);
    }
  };

  function wait<T>(ms: number, value: T) {
    return new Promise<T>((resolve) => setTimeout(resolve, ms, value));
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          width: "90%",
          justifyContent: "center",
        }}
      >
        <Text style={styles.label}>KeepCarId</Text>

        <TextInput
          style={styles.input}
          onChangeText={setKeepId}
          value={keepId}
        />
        <TouchableOpacity
          style={{
            width: "100%",
            backgroundColor: "orange",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
            justifyContent: "center",
            padding: 12,
            borderRadius: 5,
          }}
          onPress={handleSearch}
        >
          <Text style={{ marginRight: 10, color: "black", fontSize: 18 }}>
            {loading ? "Pesquisando " : "Pesquisar veículo"}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <MaterialCommunityIcons
              name="text-box-search-outline"
              size={24}
              color="black"
            />
          )}
        </TouchableOpacity>

        {!!!user && (
          <Button
            title="Voltar para login"
            onPress={() => navigation.navigate("Login")}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleHeader: {
    flexDirection: "row",
    //backgroundColor: "lightgreen",
    //: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 20,
  },
  itemImage: {
    backgroundColor: "blue",
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 15,
  },
  imgView: {
    width: 300,
    height: 200,
  },
  input: {
    //width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 5,
    height: 50,
    marginBottom: 10,
    fontSize: 18,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    //width: "75%",
    padding: 5,
    borderColor: "grey",
    borderWidth: 2,
    marginVertical: 10,
    borderRadius: 4,
    maxHeight: 140,
  },
  imageOuter: {
    flex: 1,
  },
  textOuter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    //width: "75%",
  },
  img: { width: 160, height: 120, resizeMode: "cover" },
  label: {
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 0,
    fontSize: 18,
  },
});

export default KeepCar;
