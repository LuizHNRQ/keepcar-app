import useAxios from "axios-hooks";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";

import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import { apiUrl } from "../../requests";
import { EventsType, fetchEventType } from "../../requests/eventType";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type FormData = {
  description: string;
  eventType: string;
  eventDate: Date;
};

type EventRecord = {
  label: string;
  value: string;
};

const TimeLineEvent = ({ route, navigation }: any) => {
  const { eventId } = route?.params || {};
  const [listOpen, setListOpen] = useState(false);
  const [selectEventType, setSelectEventType] = useState<EventsType[] | []>([]);
  const [date, setDate] = useState(new Date());

  const listData: EventRecord[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const listEvents = async () => {
    const events = await fetchEventType();

    if (events) {
      //console.log("EVENTOO", events);
      setSelectEventType(events);
    }
  };

  const getPickerValues = (): Array<any> => {
    if (selectEventType) {
      return selectEventType!.map((e) => ({
        label: e.title,
        value: e.id,
      }));
    }
    return [];
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: "",
      eventType: "",
      eventDate: new Date(),
    },
  });

  const onSubmit = async (data: FormData) => {
    Alert.alert(
      "Enviado",
      JSON.stringify({
        ...data,
        eventDate: dayjs(data.eventDate).format("DD/MM/YYYY"),
      })
    );
  };

  const handleAttachFiles = () => {
    console.log("anexar aqrquivo");
  };

  useEffect(() => {
    listEvents();
  }, []);

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => setListOpen(false)}
    >
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          {!!eventId ? (
            <Text>Edicao 1243</Text>
          ) : (
            <>
              <Text style={styles.header}>Detalhes</Text>

              <Text style={styles.label}>Data</Text>
              <Controller
                name="eventDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <RNDateTimePicker
                    locale="pt-BR"
                    maximumDate={new Date()}
                    style={styles.datepicker}
                    onChange={(date) => {
                      onChange(new Date(date.nativeEvent.timestamp!));
                    }}
                    value={value}
                  />
                )}
              />
              <Text style={styles.label}>Tipo</Text>
              <Controller
                control={control}
                name="eventType"
                render={({ field: { onChange, value } }) => (
                  <DropDownPicker
                    style={{ ...styles.input, marginLeft: 40 }}
                    placeholder="Selecione o tipo de registro"
                    placeholderStyle={styles.dropdownPlaceholder}
                    open={listOpen}
                    setOpen={() => setListOpen(!listOpen)}
                    items={getPickerValues()}
                    value={value}
                    setValue={(item) => onChange(item(item.name))}
                    dropDownContainerStyle={{
                      //backgroundColor: "grey",
                      borderColor: "purple",
                      width: "80%",
                      marginLeft: 40,
                    }}
                  />
                )}
                rules={{
                  required: {
                    value: true,
                    message: "Please fill out all required fields.",
                  },
                }}
              />
              {errors["eventType"]?.message ? (
                <Text style={styles.errorText}>
                  {errors["eventType"]?.message}
                </Text>
              ) : null}

              <Text style={styles.label}>Descrição</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={{ ...styles.input, height: 80 }}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    multiline={true}
                    numberOfLines={4}
                  />
                )}
                name="description"
                //rules={{ required: true }}
              />
              <Text style={styles.label}>Arquivos</Text>
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: "orange" }}
                onPress={handleAttachFiles}
              >
                <FontAwesome name="file-photo-o" size={24} color="black" />
                <Text style={{ marginLeft: 10 }}>Adicionar Arquivo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* <View style={styles.buttonSave}>
          <Button title={"Salvar"} onPress={handleSubmit(onSubmit)} />
        </View> */}
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: "purple",
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <FontAwesome name="save" size={24} color="white" />
          <Text style={{ marginLeft: 10, color: "white" }}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //paddingVertical: 20,
    width: "100%",
  },
  label: {
    alignSelf: "flex-start",
    margin: 20,
    marginLeft: "10%",
    fontSize: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    width: "75%",
  },
  input: {
    backgroundColor: "white",
    height: 50,
    padding: 10,
    borderRadius: 4,
    width: "80%",
    borderColor: "white",
  },
  dropdown: {
    borderColor: "#e4e4e4",
    backgroundColor: "#fafafa",
    marginVertical: 10,
  },
  dropdownPlaceholder: {
    color: "#c7c7c8",
  },
  errorText: {
    color: "red",
    marginTop: 20,
  },
  header: {
    fontSize: 30,
    //marginBottom: 20,
  },
  datepicker: {
    //width: "50%",
    width: 170,
    height: 50,
    padding: 10,
  },
  buttonSave: {
    color: "white",
    height: 40,
    backgroundColor: "#ec5990",
    borderRadius: 4,
    width: "80%",
  },
  outerContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 40,
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
});

export default TimeLineEvent;
