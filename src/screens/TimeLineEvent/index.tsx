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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

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

  useEffect(() => {
    listEvents();
  }, []);

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => setListOpen(false)}
    >
      <View style={styles.container}>
        {!!eventId ? (
          <Text>Edicao 1243</Text>
        ) : (
          <>
            <Text style={styles.header}>Cadastro de registro</Text>

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
                    borderColor: "skyblue",
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
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
              )}
              name="description"
              //rules={{ required: true }}
            />
            <View style={styles.button}>
              <Button title={"Salvar"} onPress={handleSubmit(onSubmit)} />
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  label: {
    alignSelf: "flex-start",
    margin: 20,
    marginLeft: "10%",
    fontSize: 20,
  },
  button: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "#ec5990",
    borderRadius: 4,
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    height: 40,
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
  },
  header: {
    fontSize: 30,
    //marginBottom: 20,
  },
  datepicker: {
    //width: "50%",
    width: 170,
    height: 40,
    padding: 10,
  },
});

export default TimeLineEvent;
