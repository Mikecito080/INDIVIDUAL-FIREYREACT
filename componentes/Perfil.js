import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { auth, db } from './firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Perfil() {
  const [favoritos, setFavoritos] = useState([]);

  const cargarFavoritos = async () => {
    try {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "Favoritos"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snap = await getDocs(q);

      const lista = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setFavoritos(lista);
    } catch (error) {
      console.log("Error cargando favoritos:", error);
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Perfil</Text>

      <Text style={{ fontSize: 18, marginTop: 10 }}>
        Nombre: {auth.currentUser?.email.split("@")[0]}
      </Text>

      <Text style={{ fontSize: 18 }}>
        Correo: {auth.currentUser?.email}
      </Text>

      <Text style={{ fontSize: 22, marginTop: 20, fontWeight: "bold" }}>
        ❤️ Tus favoritos
      </Text>

<Text style={styles.dato}>Ganados: {userData.ganados}</Text>
<Text style={styles.dato}>Perdidos: {userData.perdidos}</Text>


      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center", backgroundColor: "#ddd", padding: 10, borderRadius: 10 }}>
            <Image source={{ uri: item.imagen }} style={{ width: 80, height: 80, borderRadius: 10 }} />
            <Text style={{ fontSize: 18, marginLeft: 15 }}>{item.nombre}</Text>
          </View>
        )}
      />
    </View>
  );
}
