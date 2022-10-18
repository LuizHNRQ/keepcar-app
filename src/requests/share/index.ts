import { api } from "..";

export const fetchByKeepCarId = async (keepcarId: string) => {
  return await api.get<{ vehicleId: string }>(`/share/${keepcarId}`);
};

type keepCarResponse = {
  keepCarId: string;
  expiresAt: string;
};

type KeepCarData = {
  vehicleId: string;
  expiresAt: string;
};

export const postKeepCarId = async (vehicle: KeepCarData) => {
  try {
    const { data } = await api.post<keepCarResponse>(`/sharevehicle`, vehicle);

    return data;
  } catch (error) {
    console.log("error 100939", error);
    return error;
  }
};

export type ActiveKeysResponse = {
  id: string;
  vehicleId: string;
  expiresAt: string;
};

export const fetchActiveKeepKeys = async (vehicleId: string) => {
  return await api.get<ActiveKeysResponse[]>(`/shared/${vehicleId}`);
};

export const unshareKeepCarId = async (keepCarId: KeepCarData) => {
  return await api.put(`/unshare/${keepCarId}`);
};
