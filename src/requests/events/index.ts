import { AxiosResponse } from "axios";
import { Vehicle } from "contexts/vehicles";
import { api } from "..";

type EventValues = {
  description: string;
  eventType: string;
  eventDate: string;
  picture: ImageType & Blob;
  title: string;
  km: string;
};

type ImageType = {
  uri: string;
  filename: string;
  type: string;
  name: string;
};

export const createEvent = async (values: EventValues) => {
  try {
    const form = new FormData();
    form.append("file", values.picture);
    form.append("title", values.title);
    form.append("description", values.description);
    form.append("eventTypeId", values.eventType);
    form.append("km", values.km);
    form.append("date", values.eventDate);
    form.append("vehicleId", "A123AA");

    const { data } = await api.post<EventValues, AxiosResponse<any>>(
      "/event",
      form,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
        method: "POST",
      }
    );

    return data;
  } catch (error) {
    console.log("error 1455", error);
  }
};

export type Events = {
  id: number;
  title: string;
  km: number;
  description: string;
  pictures: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  vehicleId: string;
  eventTypeId: number;
};

export const fetchEventsByVehicleId = async (vehicleId: string) => {
  try {
    const { data } = await api.get<{ vehicle: Vehicle; events: Events[] }>(
      `/event/${vehicleId}`
    );

    return data;
  } catch (error) {
    console.log("error 1233", error);
  }
};

export const showEventDetailsById = async (eventId: string) => {
  try {
    const { data } = await api.get<Events>(`/eventdetails/${eventId}`);
    return data;
  } catch (error) {
    console.log("error 99999", error);
  }
};

export const showImageById = async (imageId: string) => {
  try {
    const { data } = await api.get<Events>(`/event/photo/${imageId}`);
    return data;
  } catch (error) {
    console.log("error img 45666", error);
  }
};
