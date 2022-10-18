import { api } from "..";

export type UserUpdateData = {
  name: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
};

export const updateUserAccount = async (
  userId: string,
  userData: UserUpdateData
) => {
  return await api.put(`/user/${userId}`, userData);
};
