import { AxiosPromise, AxiosRequestConfig } from "axios";
import { RefetchOptions } from "axios-hooks";

type AuthValues = {
  email: string;
  password: string;
};

type AuthProps = {
  values: AuthValues;
  postAuth: (
    config?: AxiosRequestConfig,
    options?: RefetchOptions
  ) => AxiosPromise<void>;
};

export const authUser = async ({ values, postAuth }: AuthProps) => {
  try {
    const { data } = await postAuth({
      data: values,
    });

    console.log("data do auth", data);
  } catch (error) {
    console.log("erro no login->", error);
  }
};
