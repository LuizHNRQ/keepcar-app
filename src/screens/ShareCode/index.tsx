import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { FontAwesome } from "@expo/vector-icons";

const ShareCode = () => {
  const [showMore, setShowMore] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [text, setText] = useState("");

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync("hello world");
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.viewHelp}
        onPress={() => setShowMore(!showMore)}
      >
        <Text>Compartilhar KeepCarId</Text>
        <FontAwesome name="question-circle-o" size={24} color="black" />
      </TouchableOpacity>
      {showMore && (
        <Text>
          Ao compartilhar o KeepCarId (código do veículo), o usuário receptor
          poderá acessar a todos os eventos cadastrados na linha do tempo do
          veículo, permitindo visualizar os ocorridos, porem sem a possibilidade
          acrescentar ou modificar quaisquer cadastros.
        </Text>
      )}
      <View>
        <Text>KeepCarId</Text>
        <Button
          title="Click here to copy to Clipboard"
          onPress={copyToClipboard}
        />
        <Button title="View copied text" onPress={fetchCopiedText} />

        <Button title="loglog" onPress={() => console.log("env->", text)} />

        <TextInput
          style={{ width: 400, height: 80, backgroundColor: "lightblue" }}
          onChangeText={(value) => setText(value)}
          //defaultValue={text}
        >
          aaaa
        </TextInput>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewHelp: {
    flexDirection: "row",
  },
});

export default ShareCode;
