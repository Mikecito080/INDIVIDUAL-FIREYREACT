import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Logout() {
  const navigation = useNavigation();

  useEffect(() => {
    const cerrarSesion = async () => {
      try {
        await signOut(auth);
        // Opcional: mostrar alerta
        // Alert.alert('Éxito', 'Has cerrado sesión');
        navigation.replace('Login'); // Redirige a Login y limpia historial
      } catch (error) {
        Alert.alert('Error al cerrar sesión', error.message);
      }
    };

    cerrarSesion();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
