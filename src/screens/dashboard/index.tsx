import useAxios from "axios-hooks";
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Events, fetchDetails } from "../../requests/events";
import { useAuth } from "../../contexts/auth";
import { apiUrl } from "../../requests";
import { EventRecord, Vehicle } from "../../contexts/vehicles";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";

import { Entypo } from "@expo/vector-icons";

type CustomVehicle = {
  id: string;
  maker: string;
  model: string;
  year: string;
  plate: string;
  updatedAt: string;
  eventsCount: number;
  lastEvent: string;
};

type ApiResponse = {
  vehicles: CustomVehicle[];
  events: Events[];
};

type Data = {
  event: Events;
};

const Dashboard = ({ route, navigation }: any) => {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState<CustomVehicle[]>(null);
  const [events, setEvents] = useState<Events[]>(null);

  const fetchDataFromApi = async () => {
    try {
      const res = await fetchDetails(user?.id.toString());

      setVehicles(res.vehicles);
      setEvents(res?.events?.slice(0, 5));
    } catch (error) {
      console.log("error 5939239", error);
    }
  };

  const handleDetailsEvent = (eventId: number) => {
    console.log("Editar evento 123", eventId);
    navigation.navigate("timelineEvent", {
      eventId: eventId,
    });
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const TimelineEvent = ({ event }: Data) => {
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventHeaderContainer}>
          <Text style={[styles.eventTextHeader, { fontWeight: "bold" }]}>
            {`${vehicles.find((ve) => ve.id === event.vehicleId).maker} - ${
              vehicles.find((ve) => ve.id === event.vehicleId).model.length > 15
                ? `${vehicles
                    .find((ve) => ve.id === event.vehicleId)
                    .model.substring(0, 12)}...`
                : vehicles.find((ve) => ve.id === event.vehicleId).model
            }`}
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

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={styles.garageview}> */}

      <Text style={styles.description}>Garagem de {user.name}</Text>

      {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginHorizontal: 9,
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        >
          <Text>Veículo cadastrados</Text>
          <Text>Ultimo registro</Text>
        </View> */}
      {/* <Text>Garagem</Text> */}
      {/* <View>
          <FlatList
            style={{ maxHeight: 160, marginTop: 10 }}
            data={vehicles}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "grey",
                  borderBottomWidth: 1,
                  marginBottom: 5,
                  marginHorizontal: 9,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{item.maker}</Text>
                  <Text>{item.model}</Text>
                </View>
                <View>
                  <Text>
                    {item.lastEvent
                      ? dayjs(item.lastEvent).format("DD/MM/YYYY")
                      : "não inserido"}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => `${item.id}${index}`}
          />
        </View> */}
      {/* </View> */}

      <Text style={styles.description2}>Ultimos 5 Eventos cadastrados</Text>
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
    backgroundColor: "purple",
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
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
  },
  headerContainer: {
    flex: 1.2,
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
    flex: 3,
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
  //GARAGE
  garageview: {
    flex: 1.6,
    //backgroundColor: "lightblue",
    width: "92%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "grey",
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 10,
  },
  description: {
    textAlign: "center",
    fontSize: 22,
    marginVertical: 10,
    fontWeight: "bold",
  },
  description2: {
    textAlign: "center",
    fontSize: 18,
  },
});
export default Dashboard;
