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

// import { Container } from './styles';

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

  const handleShowVehicleDetails = () => {
    console.log("Detalhes");
    navigation.navigate("Vehicle");
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
          <Text>Chevrolet Onix</Text>
          <Text style={styles.title}>GJL-8D50</Text>
          <Text>Ultimo Evento: 22/09</Text>
          {/* <Text style={styles.title}>{vehicle.nickname}</Text> */}
        </View>
        <View style={styles.fowardButtonView}>
          <TouchableOpacity
            style={styles.forwardButton}
            onPress={handleShowVehicleDetails}
          >
            <Entypo name="chevron-thin-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewVehicle}>
          <MaterialIcons name="add-circle" size={24} color="black" />
          <Text style={{ marginLeft: 10 }}>Adicionar Veículo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <FlatList
          data={[
            vehicles![0],
            vehicles![0],
            vehicles![0],
            vehicles![0],
            vehicles![0],
          ]}
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
    backgroundColor: "#171614",
  },
  searchContainer: {
    backgroundColor: "#5e747f",
    flexDirection: "row",
    height: "15%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
    backgroundColor: "#c6d2ed",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
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
    flex: 2,
    backgroundColor: "lightgreen",
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
    backgroundColor: "pink",
  },
});
