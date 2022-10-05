import useAxios from "axios-hooks";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useVehicle } from "../../contexts/vehicles";
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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesome } from "@expo/vector-icons";

import { postVehicle } from "../../requests/vehicles";

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

  const onSubmit = async (data: FormEventData) => {
    const vehicleData = {
      maker: brands.find((b) => b.value === data.makerId).label,
      model: models.find((m) => m.value === data.modelId).label,
      year: data.year.substring(0, 4),
      plate: data.plate,
      color: "Branco",
      km: data.km,
      purchaseYear: data.purchaseYear,
      userId: 1,
      makerId: data.makerId.toString(),
      modelId: data.modelId.toString(),
      nickname: data.nickname,
    };
    console.log("data", data);
    console.log("data ATT->", vehicleData);

    try {
      await postVehicle(vehicleData);
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
    <SafeAreaView>
      <ScrollView>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          //onPress={() => setListOpen(false)}
        >
          <View style={{ flex: 1 }}>
            <Text>New vehicles 123</Text>
            <View>
              <Text style={styles.label}>Company</Text>
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
                      placeholder="Select Company"
                      placeholderStyle={styles.placeholderStyles}
                      loading={loadingBrand}
                      activityIndicatorColor="#5188E3"
                      searchable={true}
                      searchPlaceholder="Search your company here..."
                      onOpen={onBrandOpen}
                      onChangeValue={onChange}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                )}
              />
            </View>
            <View>
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
            <View>
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
                  <TextInput
                    style={{ ...styles.input }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
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
                  <TextInput
                    style={{ ...styles.input }}
                    onBlur={onBlur}
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
                  <TextInput
                    style={{ ...styles.input }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
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
    marginHorizontal: 10,
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  placeholderStyles: {
    color: "grey",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    width: "75%",
    backgroundColor: "purple",
    marginTop: 20,
  },
  label: {
    alignSelf: "flex-start",
    margin: 20,
    marginLeft: "10%",
    fontSize: 20,
  },
  input: {
    backgroundColor: "white",
    height: 50,
    padding: 10,
    borderRadius: 4,
    width: "80%",
    borderColor: "white",
  },
});

export default NewVehicle;
