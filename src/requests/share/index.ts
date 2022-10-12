import { api } from "..";

export const fetchByKeepCarId = async (keepcarId: string) => {
  try {
    const { data } = await api.get<{ vehicleId: string }>(
      `/share/${keepcarId}`,
      { timeout: 1000 * 5 }
    );

    return data;
  } catch (error) {
    console.log("error 55543", error);
  }
};
