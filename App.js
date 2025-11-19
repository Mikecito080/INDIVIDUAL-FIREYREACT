import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./componentes/Login";
import Register from "./componentes/Register";
import Home from "./componentes/Home";
import Perfil from "./componentes/Perfil";
import Original from "./componentes/Original";
import Logout from "./componentes/Logout";
import Perfil from "./componentes/Perfil";
import Comparador from "./componentes/Comparador";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs después del login
function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Original" component={Original} />
      <Tab.Screen name="Comparador" component={Comparador} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* Rutas de autenticación */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />

        {/* Rutas de la app luego del login */}
        <Stack.Screen name="Tabs" component={Tabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
