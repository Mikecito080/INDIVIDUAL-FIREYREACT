import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace("Home"))
      .catch((err) => alert("Error: " + err.message));
  };

  return (
    <View>
      <Text>Registro</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Crear usuario" onPress={register} />
    </View>
  );
}
