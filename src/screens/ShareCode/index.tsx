import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
  ActivityIndicator,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { FontAwesome } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { postKeepCarId } from "../../requests/share";
import dayjs from "dayjs";

type ItemOption = { label: string; value: string };

const ShareCode = ({ route, navigation }: any) => {
  const { vehicleId } = route?.params;

  const [showMore, setShowMore] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [text, setText] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandSelected, setBrandSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [brands, setBrands] = useState<ItemOption[]>([
    { label: "1 dia", value: "1" },
    { label: "2 dias", value: "2" },
    { label: "3 dias", value: "3" },
    { label: "5 dias", value: "5" },
    { label: "1 semana", value: "7" },
  ]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync("hello world");
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };

  const onBrandOpen = useCallback(() => {
    console.log("abriu");
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: text,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          navigation.navigate("Garage", {
            vehicleId: vehicleId,
          });
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ expiresAt: string }>({
    defaultValues: {
      expiresAt: "",
    },
  });

  const onSubmit = async (data: { expiresAt: string }) => {
    try {
      setLoading(true);
      await setTimeout(async () => {
        console.log("AAAAA12");

        const res = await postKeepCarId({
          expiresAt: dayjs(new Date())
            .add(Number(data.expiresAt), "day")
            .toISOString(),
          vehicleId: vehicleId,
        });
        setText(res?.keepCarId);
        setHasGenerated(true);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.log("caiu no erro");
      setLoading(false);
      console.log("erru 344", error);
    }
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
        <View>
          {!hasGenerated ? (
            <View>
              <TouchableOpacity
                style={styles.viewHelp}
                onPress={() => setShowMore(!showMore)}
              >
                <Text style={styles.label}>Prazo de expiração</Text>
                <FontAwesome
                  style={{ marginTop: 15, marginLeft: 6 }}
                  name="question-circle-o"
                  size={18}
                  color="black"
                />
              </TouchableOpacity>
              {showMore && (
                <Text style={{ marginBottom: 20, marginHorizontal: 8 }}>
                  Ao compartilhar o KeepCarId (código do veículo), o usuário
                  receptor poderá acessar a todos os eventos cadastrados na
                  linha do tempo do veículo, permitindo visualizar os ocorridos,
                  porem sem a possibilidade acrescentar ou modificar quaisquer
                  cadastros.
                </Text>
              )}
              <Controller
                name="expiresAt"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      ...styles.dropdownCompany,
                      height: brandOpen ? 250 : 50,
                    }}
                  >
                    <DropDownPicker
                      style={{ ...styles.dropdown }}
                      open={brandOpen}
                      value={brandSelected}
                      setOpen={setBrandOpen}
                      setValue={setBrandSelected}
                      items={brands}
                      setItems={setBrands}
                      placeholder="Selecione o prazo..."
                      placeholderStyle={styles.placeholderStyles}
                      activityIndicatorColor="#5188E3"
                      onOpen={onBrandOpen}
                      onChangeValue={onChange}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                )}
                rules={{
                  required: {
                    value: true,
                    message: "Selecione o Prazo de expiração do keepCarId",
                  },
                }}
              />
              {errors["expiresAt"]?.message ? (
                <Text style={styles.errorText}>
                  {errors["expiresAt"]?.message}
                </Text>
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
                  marginTop: 10,
                }}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={{ marginRight: 10, color: "black", fontSize: 18 }}>
                  {loading ? "Gerando " : "Gerar KeepCarId"}
                </Text>
                {loading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <MaterialCommunityIcons
                    name="shield-key-outline"
                    size={24}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>KeepCarId</Text>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <TextInput
                  style={{
                    height: 80,
                    backgroundColor: "white",
                    width: "80%",
                    fontSize: 40,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderWidth: 4,
                    borderColor: "orange",
                    paddingLeft: 4,
                    color: "black",
                  }}
                  //onChangeText={(value) => setText(value)}
                  value={text}
                  //defaultValue={text}
                ></TextInput>
                <TouchableOpacity
                  style={{
                    backgroundColor: "orange",
                    width: "20%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                  onPress={onShare}
                >
                  <FontAwesome name="share-square-o" size={28} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewHelp: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownCompany: {
    //marginHorizontal: 10,
    //marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  placeholderStyles: {
    color: "grey",
  },
  label: {
    alignSelf: "flex-start",

    marginTop: 20,
    marginBottom: 5,
    marginLeft: 0,
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default ShareCode;
