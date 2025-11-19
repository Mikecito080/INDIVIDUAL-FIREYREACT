import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

export default function Logout({ navigation }) {
  useEffect(() => {
    signOut(auth).then(() => {
      navigation.replace("Login");
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Cerrando sesión...</Text>
    </View>
  );
}
