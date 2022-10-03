import { AxiosResponse } from "axios";
import { api } from "..";

type EventValues = {
  description: string;
  eventType: string;
  eventDate: string;
  picture: ImageType & Blob;
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
    form.append("title", values.description);
    form.append("description", values.description);
    form.append("eventTypeId", values.eventType);
    form.append("km", "46000");
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

    console.log("enevts", data);

    return data;
  } catch (error) {
    console.log("error 1455", error);
  }
};
