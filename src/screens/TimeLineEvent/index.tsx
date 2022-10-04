import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import DropDownPicker from "react-native-dropdown-picker";
import { EventsType, fetchEventType } from "../../requests/eventType";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  createEvent,
  Events,
  showEventDetailsById,
} from "../../requests/events";

type FormEventData = {
  description: string;
  eventType: string;
  eventDate: Date;
  title: string;
  km: string;
};

type EventRecord = {
  label: string;
  value: string;
};

type ImageType = {
  uri: string;
  filename: string;
  type: string;
  name: string;
};

const TimeLineEvent = ({ route, navigation }: any) => {
  const { eventId } = route?.params || {};
  const [listOpen, setListOpen] = useState(false);
  const [selectEventType, setSelectEventType] = useState<EventsType[]>([]);
  const [eventDetails, setEventDetails] = useState<Events>(null);
  const [image, setImage] = useState<ImageType>({
    uri: null,
    filename: "",
    type: "",
    name: "",
  });

  const listEvents = async () => {
    const events = await fetchEventType();

    if (events) {
      setSelectEventType(events);
    }
  };

  const showEventDetails = async (eventId: string) => {
    const details = await showEventDetailsById(eventId);

    if (details) {
      setEventDetails(details);
      // if (details.pictures) {
      //   showImage(details.pictures);
      // }
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
  } = useForm<FormEventData>({
    defaultValues: {
      description: "",
      eventType: "",
      eventDate: new Date(),
      title: "",
      km: "",
    },
  });

  const onSubmit = async (data: FormEventData) => {
    console.log("Enviado->", {
      ...data,
      eventDate: dayjs(data.eventDate).format("DD/MM/YYYY"),
      image: image,
    });
    Alert.alert(
      "Enviado",
      JSON.stringify({
        ...data,
        eventDate: dayjs(data.eventDate).format("DD/MM/YYYY"),
      })
    );

    await createEvent({
      ...data,
      eventDate: dayjs(data.eventDate).toISOString(),
      picture: image as any,
    });

    navigation.goBack();
  };

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

  useEffect(() => {
    listEvents();
  }, []);

  useEffect(() => {
    if (eventId) {
      showEventDetails(eventId);
    }
  }, [eventId]);

  return (
    <SafeAreaView>
      <ScrollView scrollEnabled={eventId && eventDetails ? false : true}>
        <TouchableWithoutFeedback
          disabled={eventId && eventDetails ? true : false}
          style={{ flex: 1 }}
          onPress={() => setListOpen(false)}
        >
          <View style={styles.outerContainer}>
            <View style={styles.container}>
              {!!eventId && eventDetails ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    width: "88%",
                    padding: 20,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      ...styles.header,
                      alignSelf: "center",
                      marginBottom: 10,
                    }}
                  >
                    {eventDetails.title}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.editContainer}>
                      <View style={styles.lineDetails}>
                        <Text style={styles.titleEdit}>Data do evento:</Text>
                        <Text style={styles.textEdit}>
                          {dayjs(eventDetails.date).format("DD/MM/YYYY")}
                        </Text>
                      </View>
                      <View style={styles.lineDetails}>
                        <Text style={styles.titleEdit}>Quilometragem:</Text>
                        <Text style={styles.textEdit}>{eventDetails.km}</Text>
                      </View>
                      <View style={styles.lineDetails}>
                        <Text style={styles.titleEdit}>Categoria:</Text>
                        <Text style={styles.textEdit}>
                          {
                            selectEventType.find(
                              (event) => event.id === eventDetails.eventTypeId
                            ).title
                          }
                        </Text>
                      </View>
                      <View
                        style={{
                          ...styles.lineDetails,
                          flexDirection: "column",
                        }}
                      >
                        <Text style={styles.titleEdit}>Detalhes:</Text>
                        <Text
                          style={{
                            ...styles.textEdit,
                            alignSelf: "center",
                          }}
                        >
                          {eventDetails.description}
                        </Text>
                      </View>
                      <View style={styles.lineDetails}>
                        <Text style={styles.titleEdit}>Imagem:</Text>
                      </View>
                      <View
                        style={{
                          ...styles.lineDetails,
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../Garage/noImageFound.png")}
                          resizeMethod="scale"
                          resizeMode="cover"
                          style={styles.itemImage}
                        />
                      </View>
                      <View style={styles.lineDetails}>
                        <Text
                          style={{
                            ...styles.textEdit,
                            color: "grey",
                            textDecorationLine: "none",
                          }}
                        >
                          Data de inserção:
                        </Text>
                        <Text
                          style={{
                            ...styles.textEdit,
                            color: "grey",
                            textDecorationLine: "none",
                          }}
                        >
                          {dayjs(eventDetails.createdAt).format(
                            "DD/MM/YYYY  hh:mm"
                          )}
                        </Text>
                      </View>
                      <View style={styles.lineDetails}>
                        <Text
                          style={{
                            ...styles.textEdit,
                            color: "grey",
                            textDecorationLine: "none",
                          }}
                        >
                          Data de edição:
                        </Text>
                        <Text
                          style={{
                            ...styles.textEdit,
                            color: "grey",
                            textDecorationLine: "none",
                          }}
                        >
                          {dayjs(eventDetails.createdAt).isSame(
                            eventDetails.updatedAt
                          )
                            ? "Nunca editado"
                            : dayjs(eventDetails.updatedAt).format(
                                "DD/MM/YYYY  hh:mm"
                              )}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, marginTop: 90, width: "100%" }}>
                    <TouchableOpacity style={styles.imgEdit} onPress={() => {}}>
                      <FontAwesome name="edit" size={24} color="white" />
                      <Text style={{ marginLeft: 10, color: "white" }}>
                        Editar Registro
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
                        listMode="SCROLLVIEW"
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

                  <Text style={styles.label}>Titulo</Text>
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
                    name="title"
                    //rules={{ required: true }}
                  />
                  <Text style={styles.label}>Quilometragem</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={{ ...styles.input }}
                        onBlur={onBlur}
                        onChangeText={(value) =>
                          onChange(value.replace(/[^0-9]/g, ""))
                        }
                        value={value}
                        keyboardType="number-pad"
                      />
                    )}
                    name="km"
                    //rules={{ required: true }}
                  />
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
                  {!!!image.uri && (
                    <TouchableOpacity
                      style={{ ...styles.button, backgroundColor: "orange" }}
                      onPress={onHandlePickImage}
                    >
                      <FontAwesome
                        name="file-photo-o"
                        size={24}
                        color="black"
                      />
                      <Text style={{ marginLeft: 10 }}>Adicionar Arquivo</Text>
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
                          style={{ ...styles.button }}
                          onPress={onHandlePickImage}
                        >
                          <MaterialCommunityIcons
                            name="image-edit-outline"
                            size={28}
                            color="black"
                          />
                          <Text style={{ marginLeft: 10 }}>
                            Alterar Arquivo
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {/* <View style={styles.buttonSave}>
          <Button title={"Salvar"} onPress={handleSubmit(onSubmit)} />
        </View> */}
                  <TouchableOpacity
                    style={{
                      ...styles.button,
                      backgroundColor: "purple",
                      marginTop: 20,
                    }}
                    onPress={handleSubmit(onSubmit)}
                  >
                    <FontAwesome name="save" size={24} color="white" />
                    <Text style={{ marginLeft: 10, color: "white" }}>
                      Salvar
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
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
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    width: "75%",
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
    justifyContent: "center",
    flexDirection: "row",
  },
  img: { width: 80, height: 80, resizeMode: "cover" },
  //edit
  editContainer: {
    flex: 1,
    // backgroundColor: "lightgreen",
    height: "100%",
  },
  lineDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  itemImage: {
    //backgroundColor: "white",
    flex: 1,
    width: 250,
    height: 180,
    resizeMode: "cover",
    marginVertical: 15,
  },
  imgEdit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    backgroundColor: "purple",
    marginTop: 20,
  },
  textEdit: {
    fontSize: 16,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "grey",
  },
  titleEdit: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TimeLineEvent;
