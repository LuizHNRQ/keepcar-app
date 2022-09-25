import { api } from "..";

export type EventsType = {
  id: number;
  title: string;
};

export const fetchEventType = async () => {
  try {
    const { data } = await api.get<EventsType[]>(`/eventtype`);
    return data;
  } catch (error) {
    console.log("error 1233", error);
  }
};
