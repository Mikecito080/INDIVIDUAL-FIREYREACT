import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";

export default function Home() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("https://thronesapi.com/api/v2/Characters")
      .then((res) => res.json())
      .then((data) => setCharacters(data));
  }, []);

  return (
    <View>
      <Text>Personajes de Game of Thrones</Text>

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100 }} />
            <Text>{item.fullName}</Text>
            <Text>{item.family}</Text>
          </View>
        )}
      />
    </View>
  );
}
