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
import { Controller, useForm } from "react-hook-form";

type FormEventData = {
  keepCardId: string;
};

const KeepCar = ({ navigation }: any) => {
  const { user } = useAuth();
  //const [keepId, setKeepId] = useState("6NH9UW");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormEventData>({
    defaultValues: {
      keepCardId: "6NH9UW",
    },
  });

  const onSubmit = async (data: FormEventData) => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const {
          data: { vehicleId },
        } = await fetchByKeepCarId(data.keepCardId.toUpperCase());

        console.log("res22->", vehicleId);
        setLoading(false);

        if (vehicleId) {
          navigation.navigate("VehicleShow", {
            vehicleId,
          });
        }
      } catch (error) {
        setLoading(false);

        setError("keepCardId", {
          type: "custom",
          message: error?.response?.data?.message,
        });
      }
    }, 3000);
  };

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
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value.toUpperCase()}
            />
          )}
          name="keepCardId"
          rules={{
            required: {
              value: true,
              message: "Informe o KeepCarId para pesquisar",
            },
            minLength: {
              value: 6,
              message: "O KeepCarId deve conter 6 dígitos",
            },
            maxLength: {
              value: 6,
              message: "O KeepCarId deve conter 6 dígitos",
            },
          }}
        />
        {errors["keepCardId"]?.message ? (
          <Text style={styles.errorText}>{errors["keepCardId"]?.message}</Text>
        ) : null}

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
          onPress={handleSubmit(onSubmit)}
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
  errorText: {
    color: "red",

    marginBottom: 10,
  },
});

export default KeepCar;
