import { AxiosResponse } from "axios";
import { api } from "..";

import { Vehicle } from "../../contexts/vehicles";

export const fetchVehicles = async (userId: number) => {
  try {
    const { data } = await api.get<Vehicle[]>(`/vehicles/${userId}`);
    console.log("passou aqui vehicles", data);
    return data;
  } catch (error) {
    console.log("error 1233", error);
  }
};
