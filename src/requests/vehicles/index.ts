import { AxiosResponse } from "axios";
import { api } from "..";

import { Vehicle } from "../../contexts/vehicles";

export const fetchVehicles = async (userId: number) => {
  try {
    const { data } = await api.get<Vehicle[]>(`/vehicles/${userId}`);

    return data;
  } catch (error) {
    console.log("error 1233", error);
  }
};

export const fetchVehicleById = async (vehicleId: string) => {
  try {
    const { data } = await api.get<Vehicle>(`/vehicle/${vehicleId}`);

    return data;
  } catch (error) {
    console.log("error 1233", error);
  }
};

type VehicleData = {
  makerId: string;
  modelId: string;
  year: string;
  plate: string;
  purchaseYear: string;
  km: string;
  nickname: string;
};

export type VehicleResponse = {
  id: string;
  nickname: string;
  maker: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  km: string;
  purchaseYear: string;
  photo?: string;
  makerId: string;
  modelId: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
};

export const postVehicle = async (vehicle: VehicleData) => {
  try {
    const { data } = await api.post<VehicleResponse[]>(`/vehicles`, vehicle);

    return data;
  } catch (error) {
    console.log("error 100939", error);
  }
};
