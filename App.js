import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Home from './componentes/Home';
import Original from './componentes/Original';
import Perfil from './componentes/Perfil';
import Logout from './componentes/Logout';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ------------------
// TABS PARA LOGUEADOS
// ------------------
function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Original" component={Original} />
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          <>
            {/* TABS SOLO PARA USUARIOS LOGUEADOS */}
            <Stack.Screen name="Tabs" component={Tabs} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registro" component={Registro} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
