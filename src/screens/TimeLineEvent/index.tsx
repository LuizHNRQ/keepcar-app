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
  showImageById,
} from "../../requests/events";
import { CommonActions } from "@react-navigation/native";
import { useVehicle } from "../../contexts/vehicles";
import { TextInputMask } from "react-native-masked-text";

type FormEventData = {
  description: string;
  eventType: string;
  eventDate: Date;
  title: string;
  km: string;
  price: string;
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
  const { eventId, vehicleId, enableEdit, allEvents } = route?.params || {};
  const { fetchVehicles } = useVehicle();
  const [editMode, setEditMode] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [selectEventType, setSelectEventType] = useState<EventsType[]>([]);
  const [eventDetails, setEventDetails] = useState<Events>(null);
  const [image, setImage] = useState<ImageType>({
    uri: null,
    filename: "",
    type: "",
    name: "",
  });
  const [editImg, setEditImg] = useState(null);

  const listEvents = async () => {
    const events = await fetchEventType();

    if (events) {
      setSelectEventType(events);
    }
  };

  const lastReportedKm = Number(allEvents?.[0]?.km) || 0;
  const lastReporteDate = allEvents?.[0]?.date || "2000-10-10T15:14:00.000Z";

  const showEventDetails = async (eventId: string) => {
    const details = await showEventDetailsById(eventId);

    if (details) {
      setEventDetails(details);
      if (details.pictures) {
        showImage(details.pictures);
      }
    }
  };

  const showImage = async (imageId: string) => {
    const img = await showImageById(imageId);
    setEditImg("data:image/png;base64," + img);
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
    setValue,

    formState: { errors },
  } = useForm<FormEventData>({
    defaultValues: {
      description: "",
      eventType: "",
      eventDate: new Date(),
      title: "",
      km: "",
      price: "",
    },
  });

  const onSubmit = async (data: FormEventData) => {
    console.log("data cru->", data.price);
    console.log("data remmovido->", data.price.replace(/\D/g, ""));

    await createEvent({
      ...data,
      vehicleId,
      km: data.km?.replace(/\D/g, ""),
      eventDate: dayjs(data.eventDate).toISOString(),
      ...(image?.filename && { picture: image as any }),
      price: data.price.replace(/\D/g, ""),
    });

    await fetchVehicles();
    //navigation .goBack();
    navigation.dispatch(
      CommonActions.navigate({
        name: "Vehicle",
        params: {
          needToReload: true,
          vehicleId: vehicleId,
        },
      })
    );
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

  useEffect(() => {
    if (eventId && eventDetails) {
      setEditMode(true);
    }
  }, [eventId, eventDetails]);

  return (
    <SafeAreaView>
      <ScrollView scrollEnabled={!!!editMode}>
        <TouchableWithoutFeedback
          disabled={editMode}
          style={{ flex: 1 }}
          onPress={() => setListOpen(false)}
        >
          <View style={styles.outerContainer}>
            <View style={styles.container}>
              {editMode ? (
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
                      <View style={styles.lineDetails}>
                        <Text style={styles.titleEdit}>Custo:</Text>
                        <Text style={styles.textEdit}>
                          {(eventDetails.price / 100).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          }) || "não cadastrado"}
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
                      <View style={styles.lineDetails}></View>
                      {editImg && (
                        <>
                          <Text style={styles.titleEdit}>Imagem:</Text>

                          <View
                            style={{
                              ...styles.lineDetails,
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              // source={{
                              //   uri: editImg && editImg,
                              // }}
                              source={
                                editImg
                                  ? { uri: editImg }
                                  : require("../Garage/noImageFound.png")
                              }
                              resizeMethod="scale"
                              resizeMode="cover"
                              style={styles.itemImage}
                            />
                          </View>
                        </>
                      )}

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
                      <View
                        style={{
                          ...styles.lineDetails,
                          marginBottom: !editImg && 200,
                        }}
                      >
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
                  {enableEdit ? (
                    <View style={{ flex: 1, marginTop: 90, width: "100%" }}>
                      <TouchableOpacity
                        style={styles.imgEdit}
                        onPress={() => {
                          setEditMode(false);
                          setValue("description", eventDetails.description);
                          setValue("km", eventDetails.km.toString());
                          setValue(
                            "eventType",
                            eventDetails.eventTypeId.toString()
                          );
                          setValue("title", eventDetails.title);
                          setValue("eventDate", new Date(eventDetails.date));
                          setImage({ ...image, uri: editImg });
                        }}
                      >
                        <FontAwesome name="edit" size={24} color="white" />
                        <Text style={{ marginLeft: 10, color: "white" }}>
                          Editar Registro
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ flex: 1, marginTop: 90, width: "100%" }}>
                      <TouchableOpacity
                        style={{
                          ...styles.imgEdit,
                          backgroundColor: "#e67220",
                        }}
                        onPress={() => navigation.goBack()}
                      >
                        {/* <FontAwesome name="edit" size={24} color="black" /> */}
                        <Text style={{ marginLeft: 10, color: "black" }}>
                          Voltar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
                        minimumDate={lastReporteDate}
                        style={styles.datepicker}
                        onChange={(date) => {
                          onChange(new Date(date.nativeEvent.timestamp!));
                        }}
                        value={value}
                      />
                    )}
                    rules={{
                      required: {
                        value: true,
                        message: "Insira a data para o registro.",
                      },
                      // validate: {
                      //   required: (value) => {
                      //     if (dayjs(value).isBefore(lastReporteDate))
                      //       return `Evento não segue a cronologia (${dayjs(
                      //         lastReporteDate
                      //       ).format("DD/MM/YYYY")})`;
                      //   },
                      // },
                    }}
                  />
                  {errors["eventDate"]?.message ? (
                    <Text style={styles.errorText}>
                      {errors["eventDate"]?.message}
                    </Text>
                  ) : null}
                  <Text style={styles.label}>Tipo</Text>
                  <Controller
                    control={control}
                    name="eventType"
                    render={({ field: { onChange, value } }) => {
                      return (
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
                            borderColor: "#6a3b96",
                            width: "80%",
                            marginLeft: 40,
                          }}
                          listMode="SCROLLVIEW"
                        />
                      );
                    }}
                    rules={{
                      required: {
                        value: true,
                        message: "Selecione o Tipo do registro",
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
                    rules={{
                      required: {
                        value: true,
                        message: "Insira o título para o registro.",
                      },
                    }}
                  />
                  {errors["title"]?.message ? (
                    <Text style={styles.errorText}>
                      {errors["title"]?.message}
                    </Text>
                  ) : null}
                  <Text style={styles.label}>Quilometragem</Text>
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
                    )}
                    name="km"
                    rules={{
                      required: {
                        value: true,
                        message: "Insira o km para o registro.",
                      },
                      // validate: {
                      //   required: (value) => {
                      //     if (Number(value.replace(/\D/g, "")) < lastReportedKm)
                      //       return `Km inferior ao último reportado (${lastReportedKm}km)`;
                      //   },
                      // },
                    }}
                  />
                  {errors["km"]?.message ? (
                    <Text style={styles.errorText}>
                      {errors["km"]?.message}
                    </Text>
                  ) : null}
                  <Text style={styles.label}>Custo</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInputMask
                        style={{ ...styles.input }}
                        type={"money"}
                        options={{
                          precision: 2,
                          separator: ",",
                          delimiter: ".",
                          unit: "R$",
                          suffixUnit: "",
                        }}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name="price"
                    rules={{
                      required: {
                        value: true,
                        message: "Insira o custo do registro.",
                      },
                    }}
                  />
                  {errors["price"]?.message ? (
                    <Text style={styles.errorText}>
                      {errors["price"]?.message}
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
                    rules={{
                      required: {
                        value: true,
                        message: "Insira o descrição para o registro.",
                      },
                    }}
                  />
                  {errors["description"]?.message ? (
                    <Text style={styles.errorText}>
                      {errors["description"]?.message}
                    </Text>
                  ) : null}
                  <Text style={styles.label}>Arquivos</Text>
                  {!!!image.uri && (
                    <TouchableOpacity
                      style={{ ...styles.button, backgroundColor: "#e67220" }}
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
                      backgroundColor: "#6a3b96",
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
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: "10%",
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
    backgroundColor: "#6a3b96",
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
