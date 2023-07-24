import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgendarCita from '../screens/AgendarCita';
import MisCitas from '../screens/MisCitas';
import StackAccountHeader from './StackAccountHeader';

const Stack = createNativeStackNavigator();

const StackChedule = () => {

  return (

    <Stack.Navigator>

      <Stack.Screen
        name="AgendarCita"
        component={AgendarCita as React.ComponentType<any>}
        options={{ headerShown: false, }}
      />

      <Stack.Screen
        name="MisCitas"
        component={MisCitas as React.ComponentType<any>}
        options={{ headerShown: false, }}
      />

      <Stack.Screen
        name="StackAccountHeader"
        component={StackAccountHeader as React.ComponentType<any>}
        options={{ headerShown: false, }}
      />

    </Stack.Navigator>

  );

};

export default StackChedule;
