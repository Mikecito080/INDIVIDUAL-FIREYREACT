import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function Home({ navigation }) {
  const [personajes, setPersonajes] = useState([]);
  const [pagina, setPagina] = useState(1);

  const cargarPersonajes = async () => {
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`);
      const data = await res.json();
      setPersonajes(data.results);
    } catch (error) {
      console.log("Error cargando personajes:", error);
    }
  };

  useEffect(() => {
    cargarPersonajes();
  }, [pagina]);

  // -----------------------------
  // 🔥 GUARDAR FAVORITO EN FIREBASE
  // -----------------------------
  const guardarFavorito = async (pj) => {
    if (!auth.currentUser) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      // Verificar si ese personaje YA fue guardado
      const q = query(
        collection(db, "Favoritos"),
        where("userId", "==", auth.currentUser.uid),
        where("personajeId", "==", pj.id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        alert("Este personaje ya está en tus favoritos ❤️");
        return;
      }

      await addDoc(collection(db, "Favoritos"), {
        userId: auth.currentUser.uid,
        personajeId: pj.id,
        nombre: pj.name,
        imagen: pj.image
      });

      alert("Añadido a favoritos ❤️");
    } catch (error) {
      console.log("Error guardando favorito:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Personajes</Text>

      <FlatList
        data={personajes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, backgroundColor: "#eee", padding: 10, borderRadius: 10 }}>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            <Text style={{ fontSize: 18, marginTop: 5 }}>{item.name}</Text>

            <TouchableOpacity
              style={{ backgroundColor: "green", padding: 10, marginTop: 10, borderRadius: 8 }}
              onPress={() => guardarFavorito(item)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Guardar en Favoritos</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Botón para cargar más personajes */}
      <TouchableOpacity
        style={{ backgroundColor: "#333", padding: 10, marginTop: 15, borderRadius: 8 }}
        onPress={() => setPagina(pagina + 1)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Cargar más personajes</Text>
      </TouchableOpacity>
    </View>
  );
}
