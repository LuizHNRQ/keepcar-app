import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";

// import { Container } from './styles';

type FormData = {
  email: string;
  password: string;
};

const TimeLineEvent = ({ route, navigation }: any) => {
  const { eventId } = route?.params || {};

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
  };

  return (
    <View style={styles.container}>
      {!!eventId ? (
        <Text>Edicao 1243</Text>
      ) : (
        <>
          <Text>Criacao</Text>
          <Text style={styles.label}>Tipo do Evento</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
            //   <TextInput
            //     autoCapitalize="none"
            //     style={styles.input}
            //     onBlur={onBlur}
            //     onChangeText={(value) => onChange(value)}
            //     value={value}
            //   />
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
            <Button title={"Salvar"} onPress={handleSubmit(onSubmit)} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    alignSelf: "flex-start",
    margin: 20,
    marginLeft: "10%",
    fontSize: 20,
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

export default TimeLineEvent;
