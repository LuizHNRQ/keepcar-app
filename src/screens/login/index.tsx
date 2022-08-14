import useAxios from "axios-hooks";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { authUser } from "../../requests/auth";

type FormData = {
  email: string;
  password: string;
};

const Login = ({ navigation }: any): JSX.Element => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: FormData) => {
    console.log("enviado_>", data);
    await authUser({ postAuth, values: data });
  };

  const API_URL = "http://127.0.0.1:3333";

  console.log("errors", errors);

  const [{ loading: loadingAuth }, postAuth] = useAxios(
    {
      method: "POST",
      url: `${API_URL}/authenticate`,
    },
    { manual: true }
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Text style={styles.label}>First name</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="email"
        rules={{ required: true }}
      />
      <Text style={styles.label}>Last name</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="password"
        rules={{ required: true }}
      />

      <View style={styles.button}>
        <Button
          title={loadingAuth ? "Carregando..." : "Login"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      <Button
        title="Go to Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "#ec5990",
    borderRadius: 4,
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    height: 40,
    padding: 10,
    borderRadius: 4,
    width: "80%",
  },
});

export default Login;
