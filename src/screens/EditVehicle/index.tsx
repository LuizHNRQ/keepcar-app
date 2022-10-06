import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useVehicle, Vehicle } from "../../contexts/vehicles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

import {
  createEvent,
  Events,
  showEventDetailsById,
  showImageById,
} from "../../requests/events";
import { editVehicle, editVehicleWithImage } from "../../requests/vehicles";

type RouteParams = {
  route: {
    params: {
      vehicleDetails: Vehicle;
    };
  };
  navigation: any;
};

const Profile = ({ route, navigation }: RouteParams) => {
  const { vehicleDetails } = route?.params;
  const { fetchVehicles } = useVehicle();

  const [editImg, setEditImg] = useState(null);
  const [vehicleNickname, setVehicleNickname] = useState<string>(
    vehicleDetails.nickname
  );
  const [vehicleColor, setVehicleColor] = useState<string>(
    vehicleDetails.color
  );

  const onHandlePickImage = async () => {
    try {
      const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (!granted) {
        const { granted: requestGranted } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!requestGranted) {
          console.log("Precisamos da sua permissão para abrir suas fotos :");
          return;
        }
      }

      const result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });

      if (!result.cancelled) {
        const localUri = result.uri;
        const filename = localUri.split("/").pop()!;

        const match = /\.(\w+)$/.exec(filename!);
        const type = match ? `image/${match[1]}` : `image`;
        setEditImg({
          uri: localUri.replace("file://", ""),
          filename,
          type,
          name: filename,
        });
      }
    } catch (err) {
      console.log("Erro ao abrir suas fotos");
    }
  };

  const showImage = async (imageId: string) => {
    const img = await showImageById(imageId);
    setEditImg({
      uri: "data:image/png;base64," + img,
    });
  };

  const handleSubmit = async () => {
    const data = {
      ...(editImg?.filename && { photo: editImg }),
      nickname: vehicleNickname,
      color: vehicleColor,
    };

    try {
      const res = editImg?.filename
        ? await editVehicleWithImage(vehicleDetails.id, data)
        : await editVehicle(vehicleDetails.id, data);

      await fetchVehicles();

      navigation.goBack({
        params: {
          vehicleId: vehicleDetails.id,
        },
      });
    } catch (error) {
      console.log("erro 5567341111");
    }
  };

  const handleResetImage = () => {
    if (vehicleDetails) {
      if (vehicleDetails.photo !== "") {
        console.log("volta ao normal");

        showImage(vehicleDetails.photo);
      }
    }
  };

  const handleDeleteVehicle = () => {
    console.log("deleta", vehicleDetails.id);
  };

  useEffect(() => {
    if (vehicleDetails) {
      if (vehicleDetails.photo !== "") {
        console.log("tem photo");

        showImage(vehicleDetails.photo);
      }
    }
  }, [vehicleDetails]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignSelf: "center", width: "90%" }}>
        <View style={styles.vehicleHeader}>
          <Text style={styles.header}>
            {`${vehicleDetails.maker.toUpperCase()} ${vehicleDetails.model.toUpperCase()}`}
          </Text>
        </View>

        {!!!editImg?.uri && (
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "orange" }}
            onPress={onHandlePickImage}
          >
            <FontAwesome name="file-photo-o" size={24} color="black" />
            <Text style={{ marginLeft: 10 }}>Adicionar Imagem</Text>
          </TouchableOpacity>
        )}
        {editImg?.uri && (
          <View style={styles.imageContainer}>
            <View style={styles.imageOuter}>
              <Image
                source={editImg && { uri: editImg?.uri }}
                style={styles.img}
              />
            </View>
            <View style={styles.textOuter}>
              <TouchableOpacity
                style={{ ...styles.button }}
                onPress={onHandlePickImage}
              >
                <MaterialCommunityIcons
                  name="image-edit-outline"
                  size={28}
                  color="black"
                />
                <Text style={{ marginLeft: 10 }}>Alterar</Text>
              </TouchableOpacity>
              {editImg?.filename && (
                <TouchableOpacity
                  style={{
                    ...styles.button,
                    width: 60,
                    backgroundColor: "red",
                  }}
                  onPress={handleResetImage}
                >
                  <MaterialCommunityIcons
                    name="cancel"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        <Text style={styles.label}>Apelido</Text>
        <TextInput
          style={styles.input}
          onChangeText={setVehicleNickname}
          value={vehicleNickname}
        />
        <Text style={styles.label}>Cor</Text>
        <TextInput
          style={styles.input}
          onChangeText={setVehicleColor}
          value={vehicleColor}
        />
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: "purple",
            marginTop: 20,
          }}
          onPress={handleSubmit}
        >
          <FontAwesome name="save" size={24} color="white" />
          <Text style={{ marginLeft: 10, color: "white" }}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: "red",
            marginTop: 20,
          }}
          onPress={handleDeleteVehicle}
        >
          <MaterialCommunityIcons name="delete" size={24} color="white" />
          <Text style={{ marginLeft: 10, color: "white" }}>
            Deletar veículo
          </Text>
        </TouchableOpacity>
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

export default Profile;
