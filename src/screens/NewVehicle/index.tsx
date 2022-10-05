import useAxios from "axios-hooks";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesome } from "@expo/vector-icons";

import { useAuth } from "../../contexts/auth";

type FormEventData = {
  company: string;
  model: string;
  year: string;
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

const NewVehicle = () => {
  const fipeUrl = "https://parallelum.com.br/fipe/api/v1";

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [gender, setGender] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);
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

  const onSubmit = (data) => {
    console.log(data, "data");
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormEventData>({
    defaultValues: {
      company: "",
      model: "",
      year: "",
    },
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (brandSelected) {
      console.log("BRAND->", brandSelected);
      fetchModels();
    }
  }, [brandSelected]);

  return (
    <View style={{ flex: 1 }}>
      <Text>New vehicles 123</Text>
      <View>
        <Text>Company</Text>
        <Controller
          name="company"
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
              />
            </View>
          )}
        />
      </View>
      <View>
        <Text>Modelo</Text>
        <Controller
          name="model"
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
              />
            </View>
          )}
        />
      </View>
      <View>
        <Text>Ano</Text>
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
              />
            </View>
          )}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <FontAwesome name="save" size={24} color="white" />
        <Text style={{ marginLeft: 10, color: "white" }}>Salvar</Text>
      </TouchableOpacity>
    </View>
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
});

export default NewVehicle;
