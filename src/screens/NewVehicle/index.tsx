import useAxios from "axios-hooks";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useVehicle } from "../../contexts/vehicles";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { postVehicle, postVehicleWithImage } from "../../requests/vehicles";
import { TextInputMask } from "react-native-masked-text";

type FormEventData = {
  makerId: string;
  modelId: string;
  year: string;
  plate: string;
  purchaseYear: string;
  km: string;
  nickname: string;
};

type ApiResponse = {
  nome: string;
  codigo: string;
};

type ModelResponse = {
  modelos: ApiResponse[];
  anos: ApiResponse[];
};

type ItemOption = { label: string; value: string };

type ImageType = {
  uri: string;
  filename: string;
  type: string;
  name: string;
};

const NewVehicle = ({ route, navigation }: any) => {
  const { fetchVehicles } = useVehicle();
  const fipeUrl = "https://parallelum.com.br/fipe/api/v1";

  const [brandOpen, setBrandOpen] = useState(false);
  const [brandSelected, setBrandSelected] = useState(null);
  const [brands, setBrands] = useState<ItemOption[]>([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelSelected, setModelSelected] = useState(null);
  const [models, setModels] = useState<ItemOption[]>([]);
  const [yearOpen, setYearOpen] = useState(false);
  const [yearSelected, setYearSelected] = useState(null);
  const [years, setYears] = useState<ItemOption[]>([]);

  const [image, setImage] = useState<ImageType>({
    uri: null,
    filename: "",
    type: "",
    name: "",
  });

  const [{ loading: loadingBrand }, getBrands] = useAxios<ApiResponse[]>(
    {
      method: "get",
      url: `${fipeUrl}/carros/marcas`,
    },
    { manual: true }
  );

  const [{ loading: loadingModel }, getModels] = useAxios<ModelResponse>(
    {
      method: "get",
      url: `${fipeUrl}/carros/marcas/${brandSelected}/modelos`,
    },
    { manual: true }
  );

  const fetchBrands = async () => {
    const { data } = await getBrands();
    setBrands(data.map((b) => ({ label: b.nome, value: b.codigo })));
  };

  const fetchModels = async () => {
    const { data } = await getModels();
    setModels(data.modelos.map((b) => ({ label: b.nome, value: b.codigo })));
    setYears(data.anos.map((b) => ({ label: b.nome, value: b.codigo })));
  };

  const onBrandOpen = useCallback(() => {
    setModelOpen(false);
    setYearOpen(false);
  }, []);

  const onModelOpen = useCallback(() => {
    setBrandOpen(false);
    setYearOpen(false);
  }, []);

  const onYearOpen = useCallback(() => {
    setBrandOpen(false);
    setModelOpen(false);
  }, []);

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
        setImage({
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

  const onSubmit = async (data: FormEventData) => {
    const vehicleData = {
      maker: brands.find((b) => b.value === data.makerId).label,
      model: models.find((m) => m.value === data.modelId).label,
      year: data.year.substring(0, 4),
      plate: data.plate,
      color: "Branco",
      km: data.km?.replace(/\D/g, ""),
      purchaseYear: data.purchaseYear,
      userId: 1,
      makerId: data.makerId.toString(),
      modelId: data.modelId.toString(),
      nickname: data.nickname,
    };
    console.log("data", data);
    console.log("data ATT->", vehicleData);

    try {
      if (image.uri) {
        await postVehicleWithImage(vehicleData, image as any);
      } else {
        await postVehicle(vehicleData);
      }
      await fetchVehicles();
      navigation.goBack();
    } catch (error) {
      console.log("erru 344", error);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormEventData>({
    defaultValues: {
      makerId: "",
      modelId: "",
      year: "",
      plate: "",
      purchaseYear: "",
      km: "",
      nickname: "",
    },
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (brandSelected) {
      //console.log("BRAND->", brandSelected);
      fetchModels();
    }
  }, [brandSelected]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          //onPress={() => setListOpen(false)}
        >
          <View style={styles.container}>
            <View>
              <Text style={styles.label}>Montadora</Text>
              <Controller
                name="makerId"
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
                      placeholder="Seleciona a montadora"
                      placeholderStyle={styles.placeholderStyles}
                      loading={loadingBrand}
                      activityIndicatorColor="#5188E3"
                      searchable={true}
                      searchPlaceholder="Pesquise por montadora aqui..."
                      onOpen={onBrandOpen}
                      onChangeValue={onChange}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                )}
              />
            </View>
            <View style={{ display: brandSelected ? "flex" : "none" }}>
              <Text style={styles.label}>Modelo</Text>
              <Controller
                name="modelId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      ...styles.dropdownCompany,
                      height: modelOpen ? 250 : 50,
                    }}
                  >
                    <DropDownPicker
                      style={styles.dropdown}
                      open={modelOpen}
                      value={modelSelected}
                      setOpen={setModelOpen}
                      setValue={setModelSelected}
                      items={models}
                      setItems={setModels}
                      placeholder="Selecione o modelo"
                      placeholderStyle={styles.placeholderStyles}
                      loading={loadingModel}
                      activityIndicatorColor="#5188E3"
                      searchable={true}
                      searchPlaceholder="Pesquise o modelo aqui..."
                      onOpen={onModelOpen}
                      onChangeValue={onChange}
                      disabled={!brandSelected}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                )}
              />
            </View>
            <View style={{ display: brandSelected ? "flex" : "none" }}>
              <Text style={styles.label}>Ano</Text>
              <Controller
                name="year"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      ...styles.dropdownCompany,
                      height: yearOpen ? 250 : 50,
                    }}
                  >
                    <DropDownPicker
                      style={styles.dropdown}
                      open={yearOpen}
                      value={yearSelected}
                      setOpen={setYearOpen}
                      setValue={setYearSelected}
                      items={years}
                      setItems={setYears}
                      placeholder="Selecione o ano"
                      placeholderStyle={styles.placeholderStyles}
                      loading={loadingModel}
                      activityIndicatorColor="#5188E3"
                      onOpen={onYearOpen}
                      onChangeValue={onChange}
                      disabled={!brandSelected}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                )}
              />
            </View>
            <View>
              <Text style={styles.label}>Placa</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputMask
                    type={"custom"}
                    style={{ ...styles.input }}
                    options={{
                      mask: "AAA-9S99",
                    }}
                    value={value}
                    onChangeText={(text) => onChange(text?.toUpperCase())}
                  />
                )}
                name="plate"
                //rules={{ required: true }}
              />
            </View>
            <View>
              <Text style={styles.label}>Ano de compra</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputMask
                    style={{ ...styles.input }}
                    type={"datetime"}
                    options={{
                      format: "YYYY",
                    }}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="purchaseYear"
                //rules={{ required: true }}
              />
            </View>
            <View>
              <Text style={styles.label}>Km atual</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputMask
                    style={{ ...styles.input }}
                    type={"money"}
                    options={{
                      precision: 0,
                      separator: ",",
                      delimiter: ".",
                      unit: "",
                      suffixUnit: "",
                    }}
                    onChangeText={onChange}
                    value={value}
                  />
                  // <TextInput
                  //   style={{ ...styles.input }}
                  //   onBlur={onBlur}
                  //   onChangeText={(text) => {
                  //     console.log("text->", text);

                  //     let value = text;

                  //     if (isNaN(Number(text))) {
                  //       value = "0";
                  //     }

                  //     value = new Intl.NumberFormat("pt-BR").format(
                  //       Number(text)
                  //     );

                  //     onChange(value);
                  //   }}
                  //   value={value}
                  // />
                )}
                name="km"
                //rules={{ required: true }}
              />
            </View>
            <View>
              <Text style={styles.label}>Apelido</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={{ ...styles.input }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="nickname"
                //rules={{ required: true }}
              />
            </View>

            <Text style={styles.label}>Imagem</Text>
            {!!!image.uri && (
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: "orange" }}
                onPress={onHandlePickImage}
              >
                <FontAwesome name="file-photo-o" size={24} color="black" />
                <Text style={{ marginLeft: 10 }}>Adicionar Imagem</Text>
              </TouchableOpacity>
            )}

            {image.uri && (
              <View style={styles.imageContainer}>
                <View style={styles.imageOuter}>
                  <Image
                    source={image && { uri: image?.uri }}
                    style={styles.img}
                  />
                </View>
                <View style={styles.textOuter}>
                  <TouchableOpacity
                    style={{ ...styles.buttonIMG }}
                    onPress={onHandlePickImage}
                  >
                    <MaterialCommunityIcons
                      name="image-edit-outline"
                      size={28}
                      color="black"
                    />
                    <Text style={{ marginLeft: 10 }}>Alterar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
            >
              <FontAwesome name="save" size={24} color="white" />
              <Text style={{ marginLeft: 10, color: "white" }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    //width: "75%",
    backgroundColor: "purple",
    marginTop: 20,
  },
  buttonIMG: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    //width: "75%",
    backgroundColor: "orange",
    //marginTop: 20,
  },
  label: {
    alignSelf: "flex-start",
    //margin: 20,
    marginTop: 15,
    //marginLeft: "10%",
    fontSize: 18,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    height: 50,
    paddingVertical: 10,
    paddingLeft: 4,
    borderRadius: 4,
    // width: "80%",
    borderColor: "white",
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
  },
  imageOuter: {
    flex: 1,
  },
  textOuter: {
    flex: 3,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    marginRight: 4,
  },
  img: { width: 140, height: 100, resizeMode: "cover" },
  //posterior
  container: {
    flex: 1,
    //backgroundColor: "lightblue",
    width: "90%",
    alignSelf: "center",
  },
});

export default NewVehicle;
