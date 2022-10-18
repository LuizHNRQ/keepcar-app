import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { useAuth } from "../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateUserAccount } from "../../requests/user";

type FormProfile = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
};

const Profile: React.FC = () => {
  const { signOut, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormProfile>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: FormProfile) => {
    try {
      const updatedData = {
        name: data.name,
        email: data.email,
        ...(data.newPassword && { oldPassword: data.currentPassword }),
        ...(data.newPassword && { newPassword: data.newPassword }),
      };

      console.log("dt->", updatedData);

      await updateUserAccount(user?.id.toString(), updatedData);
    } catch (error) {
      console.log("erru 354544", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <View style={{ flex: 1, width: "90%", alignSelf: "center" }}>
      <View
        style={{ justifyContent: "space-between", flex: 1, marginVertical: 10 }}
      >
        <View>
          <Image
            source={require("./blank_user.png")}
            resizeMethod="scale"
            resizeMode="cover"
            style={styles.img}
          />

          <View>
            <Text style={styles.label}>Nome</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                isEditing ? (
                  <TextInput
                    style={{ ...styles.input }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                ) : (
                  <Text style={styles.inputNotEdit}>{value}</Text>
                )
              }
              name="name"
              //rules={{ required: true }}
            />
          </View>
          <View>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                isEditing ? (
                  <TextInput
                    autoCapitalize="none"
                    style={{ ...styles.input }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                ) : (
                  <Text style={styles.inputNotEdit}>{value}</Text>
                )
              }
              name="email"
              //rules={{ required: true }}
            />
          </View>
          <View style={{ display: isEditing ? "flex" : "none" }}>
            <Text style={styles.label}>Senha atual</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  style={{ ...styles.input }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="********"
                  secureTextEntry
                />
              )}
              name="currentPassword"
              //rules={{ required: true }}
            />
          </View>
          <View style={{ display: isEditing ? "flex" : "none" }}>
            <Text style={styles.label}>Nova senha</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  style={{ ...styles.input }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
              name="newPassword"
              //rules={{ required: true }}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: isEditing ? "#4c7844" : "orange",
            }}
            onPress={isEditing ? handleSubmit(onSubmit) : handleEditProfile}
          >
            <Text style={{ marginRight: 10, color: "white" }}>
              {isEditing ? "Salvar alteração" : "Editar perfil"}
            </Text>
            {isEditing ? (
              <Feather name="save" size={24} color="white" />
            ) : (
              <Feather name="edit" size={24} color="white" />
            )}
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: "lightgrey" }}
              onPress={() => setIsEditing(false)}
            >
              <Text style={{ marginRight: 10, color: "black" }}>Cancelar</Text>
              <MaterialCommunityIcons name="cancel" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#c43d3d" }}
            onPress={signOut}
          >
            <Text style={{ marginRight: 10, color: "white" }}>Deslogar</Text>
            <MaterialIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    marginVertical: 5,
  },
  img: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: "white",
    alignSelf: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 8,
    fontSize: 18,
    marginBottom: 2,
  },
  input: {
    backgroundColor: "white",
    height: 50,
    paddingVertical: 10,
    paddingLeft: 4,
    borderRadius: 4,
    // width: "80%",
    borderColor: "white",
    fontSize: 18,
  },
  inputNotEdit: {
    //backgroundColor: "white",
    height: 50,
    paddingVertical: 10,
    paddingLeft: 4,
    borderRadius: 4,
    // width: "80%",
    borderColor: "white",
    fontSize: 18,
  },
});

export default Profile;
