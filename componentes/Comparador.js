import React, { useEffect, useState } from "react";
import { View, Text, Picker, Image, Button, StyleSheet, ScrollView } from "react-native";
import { db, auth } from "../firebase/FirebaseConfig";
import { setDoc, doc } from "firebase/firestore";

export default function Comparador() {
  const [characters, setCharacters] = useState([]);
  const [selectA, setSelectA] = useState(null);
  const [selectB, setSelectB] = useState(null);

  const [charA, setCharA] = useState(null);
  const [charB, setCharB] = useState(null);

  // Obtiene personajes de la API
  useEffect(() => {
    fetch("https://thronesapi.com/api/v2/Characters")
      .then(res => res.json())
      .then(data => setCharacters(data));
  }, []);

  // Cuando cambia el seleccionador, toma el objeto completo
  useEffect(() => {
    setCharA(characters.find(c => c.id == selectA));
    setCharB(characters.find(c => c.id == selectB));
  }, [selectA, selectB]);

  // Guardar favorito en Firebase
  const guardarFavorito = async (personaje) => {
    const user = auth.currentUser;
    if (!user) return alert("Debes iniciar sesión");

    await setDoc(doc(db, "favoritos", `${user.uid}_${personaje.id}`), {
      uid: user.uid,
      id: personaje.id,
      fullName: personaje.fullName,
      family: personaje.family,
      imageUrl: personaje.imageUrl,
      fecha: new Date().toISOString()
    });

    alert("✔ Personaje guardado como favorito");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Comparador de Personajes</Text>

      {/* SELECT A */}
      <Text style={styles.subtitle}>Selecciona el Personaje A:</Text>
      <Picker selectedValue={selectA} onValueChange={v => setSelectA(v)}>
        <Picker.Item label="Seleccione uno" value={null} />
        {characters.map(c => (
          <Picker.Item key={c.id} label={c.fullName} value={c.id} />
        ))}
      </Picker>

      {/* SELECT B */}
      <Text style={styles.subtitle}>Selecciona el Personaje B:</Text>
      <Picker selectedValue={selectB} onValueChange={v => setSelectB(v)}>
        <Picker.Item label="Seleccione uno" value={null} />
        {characters.map(c => (
          <Picker.Item key={c.id} label={c.fullName} value={c.id} />
        ))}
      </Picker>

      {/* RESULTADO */}
      {(charA && charB) && (
        <View>
          <Text style={styles.section}>Resultado de la Comparación</Text>

          <View style={styles.compareBox}>
            
            {/* Personaje A */}
            <View style={styles.card}>
              <Image source={{ uri: charA.imageUrl }} style={styles.img} />
              <Text style={styles.name}>{charA.fullName}</Text>
              <Text style={styles.family}>{charA.family}</Text>
              <Button title="⭐ Favorito" onPress={() => guardarFavorito(charA)} />
            </View>

            {/* Personaje B */}
            <View style={styles.card}>
              <Image source={{ uri: charB.imageUrl }} style={styles.img} />
              <Text style={styles.name}>{charB.fullName}</Text>
              <Text style={styles.family}>{charB.family}</Text>
              <Button title="⭐ Favorito" onPress={() => guardarFavorito(charB)} />
            </View>

          </View>

          {/* Comparación simple */}
          <Text style={styles.compareText}>
            {charA.fullName} pertenece a la casa {charA.family}, mientras que {charB.fullName} pertenece a la casa {charB.family}.
          </Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, marginTop: 10 },
  section: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },
  compareBox: { flexDirection: "row", justifyContent: "space-between" },
  card: { width: "48%", alignItems: "center", padding: 10, backgroundColor: "#eee", borderRadius: 8 },
  img: { width: 120, height: 120, borderRadius: 8, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  family: { fontSize: 14, marginBottom: 10, color: "#444" },
  compareText: { marginTop: 20, fontSize: 16 }
});
