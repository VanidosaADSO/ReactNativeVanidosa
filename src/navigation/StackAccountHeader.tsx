import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountHeader from '../screens/AccountHeader';
import Login from '../screens/Login';
import Registro from '../screens/Registro';

const Stack = createNativeStackNavigator();

const StackAccountHeader = () => {

  return (

    <Stack.Navigator>

      <Stack.Screen
        name="AccountHeader"
        component={AccountHeader as React.ComponentType<any>}
        options={{
          title: 'Iniciar sesión', //Cambia título por defecto de "header"
          headerShown: false, // Oculta o muestra el "header"
          headerShadowVisible: true, // Oculta o muestra box shadow de header
          headerStyle: { backgroundColor: '#ffffff' }, // Cambia color de fondo de "header"
          headerTitleAlign: 'center', // Alinea título de "header"
          headerTintColor: '#7e7e7e', // Cambia color de flecha y título  de "header"
          headerTitleStyle: { fontWeight: '300' }, // Cambia peso de tipografía de título de "header"
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login as React.ComponentType<any>}
        options={{
          title: 'Iniciar sesión', //Cambia título por defecto de "header"
          headerShown: false, // Oculta o muestra el "header"
          headerShadowVisible: true, // Oculta o muestra box shadow de header
          headerStyle: { backgroundColor: '#ffffff' }, // Cambia color de fondo de "header"
          headerTitleAlign: 'center', // Alinea título de "header"
          headerTintColor: '#7e7e7e', // Cambia color de flecha y título  de "header"
          headerTitleStyle: { fontWeight: '300' }, // Cambia peso de tipografía de título de "header"
        }}
      />

      <Stack.Screen
        name="Registro"
        component={Registro as React.ComponentType<any>}
        options={{
          title: 'Registro', //Cambia título por defecto de "header"
          headerShown: false, // Oculta o muestra el "header"
          headerShadowVisible: true, // Oculta o muestra box shadow de header
          headerStyle: { backgroundColor: '#ffffff' }, // Cambia color de fondo de "header"
          headerTitleAlign: 'center', // Alinea título de "header"
          headerTintColor: '#7e7e7e', // Cambia color de flecha y título  de "header"
          headerTitleStyle: { fontWeight: '300' }, // Cambia peso de tipografía de título de "header"
        }}
      />

    </Stack.Navigator>
    
  );
  
};

export default StackAccountHeader;

