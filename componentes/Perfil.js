import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { auth, db } from "../firebase/FirebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Profile() {
  const user = auth.currentUser;

  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Consulta en tiempo real
    const q = query(collection(db, "favoritos"), where("uid", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFavoritos(lista);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>Perfil</Text>

      <Text>Email: {user?.email}</Text>

      <Text style={styles.subtitle}>Mis Personajes Favoritos</Text>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <View>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.family}>{item.family}</Text>
            </View>
          </View>
        )}
      />

      {favoritos.length === 0 && (
        <Text style={{ marginTop: 10 }}>Aún no tienes favoritos.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 20, marginTop: 20, marginBottom: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10
  },
  img: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "bold" },
  family: { fontSize: 14, color: "#444" }
});
