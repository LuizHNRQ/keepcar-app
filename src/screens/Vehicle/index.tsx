import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { EventRecord, Vehicle } from "../../contexts/vehicles";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";

import dayjs from "dayjs";
import { Events, fetchEventsByVehicleId } from "../../requests/events";

type Data = {
  event: EventRecord;
};

const Dashboard = ({ route, navigation }: any) => {
  const { vehicleId } = route?.params;

  const isViewMode = true;
  const [vehicleData, setVehicleData] = useState<Vehicle>(null);
  const [events, setEvents] = useState<Events[]>(null);

  const fetchVehicleData = async () => {
    const data = await fetchEventsByVehicleId(vehicleId);

    if (data) {
      setVehicleData(data.vehicle);
      setEvents(data.events);
    }
  };

  const handleNewEvent = () => {
    navigation.navigate("timelineEvent", {
      vehicleId: vehicleId,
      allEvents: events,
    });
  };

  const handleShareCode = () => {
    navigation.navigate("ShareCode", {
      vehicleId: vehicleId,
    });
  };

  const handleReport = () => {
    console.log("gera relatorio");
  };

  const handleEditVehicle = () => {
    navigation.navigate("EditVehicle", {
      vehicleDetails: vehicleData,
      vehicleId: vehicleId,
    });
  };

  const handleDetailsEvent = (eventId: number) => {
    console.log("Editar evento", eventId);
    navigation.navigate("timelineEvent", {
      eventId: eventId,
      enableEdit: true,
    });
  };

  const TimelineEvent = ({ event }: Data) => {
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventHeaderContainer}>
          <Text style={[styles.eventTextHeader, { fontWeight: "bold" }]}>
            {event.km + " km"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {dayjs(event.date).isAfter(
              dayjs(event.createdAt).subtract(15, "days")
            ) && (
              <MaterialIcons
                style={{ alignSelf: "center", marginRight: 5 }}
                name="verified"
                size={18}
                color="#1DA1F2"
              />
            )}

            <Text style={styles.eventTextHeader}>
              {dayjs(event.date).format("DD/MM/YY")}
            </Text>
          </View>
        </View>
        <View style={styles.eventContentContainer}>
          <View style={styles.eventDescriptionConmtainer}>
            <Text style={styles.eventDescriptionText}>{event.title}</Text>
          </View>
          <View style={styles.eventMoreDetailsContainer}>
            <TouchableOpacity
              style={styles.forwardButton}
              onPress={() => handleDetailsEvent(event.id)}
            >
              <Entypo name="chevron-thin-right" size={24} color="#353036" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleData();
    }
  }, [route]);

  return (
    <View style={styles.container}>
      {!vehicleData ? (
        <Text>carregando....</Text>
      ) : (
        <View style={{ marginTop: 0, alignItems: "center", flex: 1 }}>
          <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
            <View style={{ marginVertical: 10 }}>
              <Text
                style={{ width: "100%", fontSize: 20, fontWeight: "bold" }}
                numberOfLines={1}
              >
                {vehicleData.nickname
                  ? `${vehicleData.nickname.toUpperCase()}`
                  : `${vehicleData.maker.toUpperCase()}`}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity
                style={{
                  ...styles.card2,
                }}
                onPress={handleEditVehicle}
              >
                <View style={styles.interior2}>
                  <AntDesign
                    name="edit"
                    size={24}
                    color="white"
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={{ color: "white" }}>Editar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.card2,
                }}
                onPress={handleReport}
              >
                <View style={styles.interior2}>
                  <AntDesign
                    name="copy1"
                    size={24}
                    color="white"
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={{ color: "white" }}>Relatório</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.card2,
                }}
                onPress={handleShareCode}
              >
                <View style={styles.interior2}>
                  <AntDesign
                    name="sharealt"
                    size={24}
                    color="white"
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={{ color: "white" }}>KeepCarId</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.card2,
                  backgroundColor: "purple",
                }}
                onPress={handleNewEvent}
              >
                <View style={styles.interior2}>
                  <MaterialIcons
                    name="add-circle"
                    size={24}
                    color="white"
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={{ color: "white" }}>Evento</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.timelimeTitle}>
            {events?.length === 0
              ? "Adicione eventos para visualizar aqui"
              : "Linha do tempo"}
          </Text>
          <View style={styles.cardContainer}>
            <FlatList
              data={events}
              renderItem={({ item }) => (
                <>
                  <TimelineEvent event={item} key={item.id} />
                  {item.id !== events[events.length - 1].id && (
                    <View style={styles.arrowConatainer}>
                      <FontAwesome
                        name="long-arrow-down"
                        size={24}
                        color="#353036"
                      />
                    </View>
                  )}
                </>
              )}
              keyExtractor={(item, index) => `${item.id}${index}`}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "lightgrey",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "white",
    backgroundColor: "#6a3b96",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    width: "75%",
    marginTop: 10,
  },

  timelimeTitle: {
    fontSize: 20,
  },
  vehicleHeader: {
    flexDirection: "row",
    //backgroundColor: "lightgreen",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
  },
  headerContainer: {
    // flex: 0.6,
    //ackgroundColor: "lightblue",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  //CARD STYLE
  forwardButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
    flex: 3.5,
  },
  eventContainer: {
    backgroundColor: "white",
    //marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "column",
    borderColor: "#353036",
    borderStyle: "solid",
    borderWidth: 1,
    height: 100,
    display: "flex",
    flex: 1,
    borderRadius: 4,
  },
  eventHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1.2,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#f5cdf7",
  },
  eventTextHeader: {
    fontSize: 18,
  },
  eventContentContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  eventDescriptionConmtainer: {
    //backgroundColor: "lightgreen",
    flex: 7,
  },
  eventMoreDetailsContainer: {
    //backgroundColor: "pink",
    flex: 1,
    borderLeftWidth: 1,
    borderColor: "#5e747f",
    paddingLeft: 8,
  },
  eventDescriptionText: {
    fontSize: 14,
  },
  arrowConatainer: {
    //alignItems: "center",
    marginLeft: "12%",
    justifyContent: "center",
    marginBottom: 8,
  },
  //config
  configurationView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  headerBtn: {
    backgroundColor: "#8fcddb",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    width: "42%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  //extras
  card2: {
    backgroundColor: "#ec5990",
    width: "20%",
    height: 100,
    borderRadius: 5,
  },
  interior2: {
    justifyContent: "space-evenly",
    height: "100%",
    alignItems: "center",
  },
});

export default Dashboard;
