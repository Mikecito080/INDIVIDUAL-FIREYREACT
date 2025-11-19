import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { auth, db } from "../firebase/FirebaseConfig";
import { setDoc, doc } from "firebase/firestore";

export default function Original() {
  const [favorite, setFavorite] = useState("");

  const saveFavorite = async () => {
    const user = auth.currentUser;

    if (!user) return alert("Debes iniciar sesión");

    await setDoc(doc(db, "favoritos", user.uid), {
      personajeFavorito: favorite,
      fecha: new Date().toISOString()
    });

    alert("Guardado en Firebase!");
  };

  return (
    <View>
      <Text>Guardar Personaje Favorito</Text>
      <TextInput placeholder="Escribe el nombre" onChangeText={setFavorite} />
      <Button title="Guardar" onPress={saveFavorite} />
    </View>
  );
}
