import { api } from "..";

export const fetchByKeepCarId = async (keepcarId: string) => {
  try {
    const { data } = await api.get<{ vehicleId: string }>(
      `/share/${keepcarId}`,
      { timeout: 1000 * 5 }
    );

    return data;
  } catch (error) {
    console.log("error 55543", error.response);
    return error;
  }
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
