import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { EventRecord, Vehicle } from "../../contexts/vehicles";
import { fetchVehicleById } from "../../requests/vehicles";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

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
    console.log("Novo evento");
    navigation.navigate("timelineEvent");
  };

  const handleDetailsEvent = (eventId: number) => {
    console.log("Novo evento", eventId);
    navigation.navigate("timelineEvent", {
      eventId: eventId,
    });
  };

  const TimelineEvent = ({ event }: Data) => {
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventHeaderContainer}>
          <Text style={[styles.eventTextHeader, { fontWeight: "bold" }]}>
            {event.km + " km"}
          </Text>
          <Text style={styles.eventTextHeader}>
            {dayjs(event.date).format("DD/MM/YY")}
          </Text>
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
              <Entypo name="chevron-thin-right" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* <Text>{event.description}</Text> */}
        </View>
      </View>
    );
  };

  useEffect(() => {
    console.log("Renderizou");
    if (vehicleId) {
      fetchVehicleData();
    }
  }, []);

  return (
    <View style={styles.container}>
      {!vehicleData ? (
        <Text>carregando....</Text>
      ) : (
        <View style={{ marginTop: 20, alignItems: "center", flex: 1 }}>
          <View style={styles.headerContainer}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.header}>
                {`${vehicleData.maker.toUpperCase()} ${vehicleData.model.toUpperCase()}`}
                {/* /${dayjs(vehicleData.year).format("YY")} */}
              </Text>
              {/* <MaterialIcons name="ios-share" size={24} color="black" /> */}
            </View>

            <Text style={styles.subHeader}>
              {vehicleData.plate.toUpperCase()}
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleNewEvent}>
              <MaterialIcons name="add-circle" size={24} color="black" />
              <Text style={{ marginLeft: 10 }}>Adicionar Evento</Text>
            </TouchableOpacity>

            {/* <Text style={styles.timelimeTitle}>Linha do tempo</Text> */}
          </View>

          <Text style={styles.timelimeTitle}>Linha do tempo</Text>
          <View style={styles.cardContainer}>
            <FlatList
              data={events}
              renderItem={({ item }) => (
                <>
                  <TimelineEvent event={item} key={item.id} />
                  <View style={styles.arrowConatainer}>
                    <FontAwesome
                      name="long-arrow-down"
                      size={24}
                      color="black"
                    />
                  </View>
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
    backgroundColor: "lightgrey",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    width: "75%",
    marginVertical: 10,
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
  header: { fontSize: 32, fontWeight: "bold" },
  subHeader: {
    fontSize: 26,
  },
  headerContainer: {
    flex: 1,
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
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
    height: 100,
    display: "flex",
    flex: 1,
    borderRadius: 2,
  },
  eventHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1.4,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    // backgroundColor: "lightgreen",
    flex: 7,
  },
  eventMoreDetailsContainer: {
    //backgroundColor: "pink",
    flex: 1,
    borderLeftWidth: 2,
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
});

export default Dashboard;
