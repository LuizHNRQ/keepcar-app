import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  SafeAreaView,
  ListRenderItem,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useVehicle, Vehicle } from "../../contexts/vehicles";

type Data = {
  vehicle: Vehicle;
};

const Dashboard: React.FC = ({ navigation }: any) => {
  const { vehicles } = useVehicle();

  const handleNewVehicle = () => {
    console.log("novo veiculo");
  };

  const handleSearch = () => {
    console.log("pesquisa");
  };

  const handleShowVehicleDetails = (vehicleID: string) => {
    navigation.navigate("Vehicle", {
      vehicleId: vehicleID,
    });
  };

  const Item = ({ vehicle }: Data) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemImageView}>
          <Image
            source={require("./noImageFound.png")}
            resizeMethod="scale"
            resizeMode="cover"
            style={styles.itemImage}
          />
        </View>
        <View style={styles.itemTextView}>
          <Text>{`${vehicle.maker.toUpperCase()} ${vehicle.model.toUpperCase()} - ${
            vehicle.nickname
          }`}</Text>
          <Text style={styles.title}>{vehicle.plate.toUpperCase()}</Text>
          <Text>Eventos cadastrados: {vehicle?.events?.length}</Text>
        </View>
        <View style={styles.fowardButtonView}>
          <TouchableOpacity
            style={styles.forwardButton}
            onPress={() => {
              console.log("id do vehicles", vehicle.id);
              handleShowVehicleDetails(vehicle.id);
            }}
          >
            <Entypo name="chevron-thin-right" size={24} color="#353036" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewVehicle}>
          <MaterialIcons name="add-circle" size={24} color="white" />
          <Text style={{ marginLeft: 10, color: "white" }}>
            Adicionar Veículo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#353036" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <FlatList
          data={vehicles}
          renderItem={({ item }) => <Item vehicle={item} />}
          keyExtractor={(item, index) => item.id + index}
        />
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#171614",
  },
  searchContainer: {
    backgroundColor: "#d4defa",
    flexDirection: "row",
    height: "12%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "purple",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    width: "75%",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    width: "15%",
  },
  cardContainer: {
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
    flex: 1,
  },
  item: {
    //backgroundColor: "#c6d2ed",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    //borderWidth: 1,
  },
  itemImage: {
    backgroundColor: "white",
    flex: 1,
    width: 100,
    height: 100,
    // resizeMode: "contain",
  },
  title: {
    fontSize: 32,
  },
  itemImageView: {
    flex: 1,
  },
  itemTextView: {
    marginLeft: 10,
    flex: 2,
    //backgroundColor: "lightgreen",
    justifyContent: "space-between",
  },
  fowardButtonView: {
    backgroundColor: "lightBlue",

    flex: 0.4,
  },
  forwardButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "pink",
    backgroundColor: "#f5cdf7",
    borderRadius: 5,
  },
});
