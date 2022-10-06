import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../contexts/auth";

type FormData = {
  email: string;
  password: string;
};

const Login = ({ navigation }: any): JSX.Element => {
  const { signed, signIn, loading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "luiz@test.com",
      password: "101010",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("enviado_>", data);
    await signIn(data);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          width: "90%",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            marginVertical: 40,
            alignSelf: "center",
            fontSize: 68,
            color: "purple",
          }}
        >
          KeepCar
        </Text>
        <Text style={styles.label}>Email</Text>
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
        <Text style={styles.label}>Senha</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
          rules={{ required: true }}
        />

        <TouchableOpacity
          style={styles.button2}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {/* <MaterialIcons name="add-circle" size={24} color="white" /> */}
          <Text style={{ marginLeft: 10, color: "white", fontSize: 18 }}>
            {loading ? "Carregando..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Button
          title="Go to Register"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "#ec5990",
    borderRadius: 4,
    //width: "80%",
  },
  input: {
    backgroundColor: "white",
    height: 50,
    padding: 10,
    borderRadius: 4,
    //width: "80%",
  },
  button2: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "white",
    backgroundColor: "purple",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    height: 50,
    marginTop: 40,
    marginBottom: 5,
  },
});

export default Login;
