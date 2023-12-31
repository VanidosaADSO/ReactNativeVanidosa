import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

interface HeaderSettingsReturnShadowProps {
  title: string;
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

const HeaderSettingsReturnShadow = ({ navigation, title }: HeaderSettingsReturnShadowProps) => {

  const handleGoBack = () => {
    navigation.goBack();
  };

  // ------------Código redireccion dependiendo del estado de login-------------
  const handleIconPress = () => {
    AsyncStorage.getItem('userToken') // Obtener el token del AsyncStorage
      .then(token => {
        if (token) {
          navigation.navigate('StackAccountHeader'); // Si hay token, el usuario está logueado
        } else {
          navigation.navigate('StackAccount'); // Si no hay token, el usuario no está logueado
        }
      })
      .catch(error => {
        console.error(error);
        // Manejar el error si es necesario
      });
  };
  // --------------------------------------------------------------------------

  return (

    <View style={styles.contentCustomHeader}>

      <TouchableOpacity style={styles.contentBackIcon} onPress={handleGoBack}>
        <Ionicons style={styles.backIcon} name="arrow-back-outline" />
      </TouchableOpacity>

      <Text style={styles.customHeaderText}>{title}</Text>

      <TouchableOpacity style={styles.contentAccountIcon} onPress={handleIconPress}>
        <Ionicons style={styles.accountIcon} name='settings-outline' />
      </TouchableOpacity>


    </View>

  );

};

export default HeaderSettingsReturnShadow; 

// ********** Estilos CSS **********
const styles = StyleSheet.create({
  contentCustomHeader: {
    height: 70,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#6e6e6e', // Superpone color "#ffffff" sobre el color por defecto
    elevation: 6, // Crea efecto boxshadow"
    marginBottom: 3, // Permite ver el efecto "boxshadow" de la propiedad "elevation:"
  },
  contentBackIcon: {
    position: 'absolute',
    left: 16,
    padding: 10,
    zIndex: 1,
  },
  backIcon: {
    color: '#4e4e4e',
    fontSize: 24,
  },
  customHeaderText: {
    fontFamily: 'Aspira W05 Demi',
    textAlign: 'center',
    color: '#4e4e4e',
    fontSize: 22,
    letterSpacing: 0.3,
  },
  contentAccountIcon: {
    position: 'absolute',
    right: 16,
    padding: 10,
    zIndex: 1,
  },
  accountIcon: {
    color: '#5B009D',
    fontSize: 24,
  },
});