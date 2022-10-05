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

type ImageType = {
  uri: string;
  filename: string;
  type: string;
  name: string;
};

type vehicleProps = {
  maker: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  km: string;
  purchaseYear: string;
  userId: number;
  makerId: string;
  modelId: string;
  nickname: string;
};

export const postVehicleWithImage = async (
  vehicle: vehicleProps,
  photo: ImageType & Blob
) => {
  try {
    const form = new FormData();
    form.append("file", photo);
    form.append("maker", vehicle.maker);
    form.append("model", vehicle.model);
    form.append("year", vehicle.year);
    form.append("plate", vehicle.plate);
    form.append("color", vehicle.color);
    form.append("km", vehicle.km);
    form.append("purchaseYear", vehicle.purchaseYear);
    form.append("userId", vehicle.userId.toString());
    form.append("makerId", vehicle.makerId);
    form.append("modelId", vehicle.modelId);
    form.append("nickname", vehicle.nickname);

    const { data } = await api.post<
      vehicleProps,
      AxiosResponse<VehicleResponse[]>
    >("/vehicles", form, {
      headers: {
        "Content-type": "multipart/form-data",
      },
      method: "POST",
    });

    return data;
  } catch (error) {
    console.log("error 55355", error);
  }
};
