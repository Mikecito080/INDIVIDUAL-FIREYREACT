import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

// ✔️ Sumar victoria
const sumarVictoria = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "usuarios", user.uid);
  await updateDoc(ref, { ganados: increment(1) });
};

// ✔️ Sumar derrota
const sumarDerrota = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "usuarios", user.uid);
  await updateDoc(ref, { perdidos: increment(1) });
};

if (resultado === "ganaste") {
  sumarVictoria();
} else if (resultado === "perdiste") {
  sumarDerrota();
}


const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-:.\' '.split('');
const MAX_ATTEMPTS = 5;

export default function Original() {
  const [characterName, setCharacterName] = useState('');
  const [characterImage, setCharacterImage] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [episode, setEpisode] = useState('');
  const [hint, setHint] = useState('');

  const [userWin, setUserWin] = useState(0);
  const [userLose, setUserLose] = useState(0);
  const [uid, setUid] = useState(null);

  // Escuchar usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return unsubscribe;
  }, []);

  // Traer estadísticas del usuario
  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserWin(data.ganados || 0);
        setUserLose(data.perdidos || 0);
      } else {
        await setDoc(docRef, { ganados: 0, perdidos: 0 });
        setUserWin(0);
        setUserLose(0);
      }
      setLoading(false);
    };
    traerDatos();
  }, [uid]);

  const guardarResultado = async (acierto) => {
    if (!uid) return;
    const fecha = new Date().toISOString();
    const resultado = {
      uid,
      character: characterName,
      aciertos: acierto ? 1 : 0,
      errores: acierto ? 0 : 1,
      fecha,
    };

    try {
      await setDoc(doc(db, 'resultados', `${uid}_${fecha}`), resultado);
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, {
        ganados: acierto ? userWin + 1 : userWin,
        perdidos: !acierto ? userLose + 1 : userLose,
      });
    } catch (e) {
      console.error('Error al guardar resultado:', e);
    }
  };

  // Obtener personaje aleatorio
  const getRandomCharacter = async () => {
    setLoading(true);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
    setEpisode('');
    setHint('');

    const id = Math.floor(Math.random() * 826) + 1; // Rick & Morty tiene 826 personajes
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      const data = await res.json();
      setCharacterName(data.name.toUpperCase());
      setCharacterImage(data.image);
      setHint(`${data.species} - ${data.status}`); // Pista original

      // Traer primer episodio
      const epRes = await fetch(data.episode[0]);
      const epData = await epRes.json();
      setEpisode(epData.name);

    } catch (err) {
      console.error('Error al obtener personaje:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getRandomCharacter();
  }, []);

  // Lógica de letras
  const handleLetterClick = async (letter) => {
    if (guessedLetters.includes(letter) || gameOver || gameWon) return;

    const updatedGuessed = [...guessedLetters, letter];
    setGuessedLetters(updatedGuessed);

    if (!characterName.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= MAX_ATTEMPTS) {
        setGameOver(true);
        setUserLose(userLose + 1);
        await guardarResultado(false);
      }
    } else {
      const allCorrect = characterName.split('').every((l) => updatedGuessed.includes(l));
      if (allCorrect) {
        setGameWon(true);
        setUserWin(userWin + 1);
        await guardarResultado(true);
      }
    }
  };

  const renderWord = () =>
    characterName.split('').map((letter, index) => (
      <Text key={index} style={styles.letter}>
        {guessedLetters.includes(letter) || gameOver || gameWon ? letter : '_'}
      </Text>
    ));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adivina el Personaje Rick & Morty</Text>
      <Text style={styles.stats}>Ganados: {userWin} | Perdidos: {userLose}</Text>

      {loading ? <ActivityIndicator size="large" /> : (
        <>
          <Image source={{ uri: characterImage }} style={styles.image} />
          <Text style={styles.hint}>Pista: {hint}</Text>
          <View style={styles.wordContainer}>{renderWord()}</View>

          <View style={styles.keyboard}>
            {ALPHABET.map((letter) => (
              <TouchableOpacity
                key={letter}
                onPress={() => handleLetterClick(letter)}
                disabled={guessedLetters.includes(letter) || gameOver || gameWon}
                style={[styles.key, guessedLetters.includes(letter) && styles.keyDisabled]}
              >
                <Text>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.attempts}>Fallos: {wrongGuesses} / {MAX_ATTEMPTS}</Text>

          {gameOver && <Text style={styles.lost}>💀 ¡Perdiste! Era: {characterName}</Text>}
          {gameWon && <Text style={styles.won}>🎉 ¡Ganaste! Primer episodio: {episode}</Text>}

          {(gameOver || gameWon) && (
            <TouchableOpacity style={styles.button} onPress={getRandomCharacter}>
              <Text style={styles.buttonText}>Jugar otra vez</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10, textAlign: 'center' },
  image: { width: 150, height: 150, marginVertical: 10 },
  stats: { marginBottom: 10, fontSize: 16 },
  hint: { fontStyle: 'italic', marginBottom: 10 },
  wordContainer: { flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' },
  letter: { fontSize: 28, marginHorizontal: 4 },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  key: {
    backgroundColor: '#eee',
    padding: 10,
    margin: 4,
    borderRadius: 4,
    width: 40,
    alignItems: 'center',
  },
  keyDisabled: { backgroundColor: '#ccc' },
  attempts: { fontSize: 16, marginBottom: 10 },
  lost: { color: 'red', fontSize: 18 },
  won: { color: 'green', fontSize: 18 },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#0066cc',
    borderRadius: 5,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

