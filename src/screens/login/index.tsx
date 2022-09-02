import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import AuthContext from "../../contexts/auth";

type FormData = {
  email: string;
  password: string;
};

const Login = ({ navigation }: any): JSX.Element => {
  const { signed, signIn, loading } = useContext(AuthContext);

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

    const response = await signIn(data);
    console.log(response);

    // useAppDispatch(authUser({ email: data.email, password: data.password }));
    //await authUser({ postAuth, values: data });
  };

  console.log("errors", errors);

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
          title={false ? "Carregando..." : "Login"}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />
      </View>
      {/* <View>{JSON.stringify(user) ?? "teste"}</View> */}

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
