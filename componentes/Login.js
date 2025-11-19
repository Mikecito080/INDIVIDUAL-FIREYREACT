import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace("Tabs"))
      .catch((err) => alert("Error: " + err.message));
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Entrar" onPress={login} />
      <Button title="Registrarse" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
