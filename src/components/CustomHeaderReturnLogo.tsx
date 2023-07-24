import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomHeaderReturnLogoProps {
  title: string;
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

const CustomHeaderReturnLogo = ({ navigation }: CustomHeaderReturnLogoProps) => {


  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleIconPress = () => {
    navigation.navigate('StackAccountHeader');
  };

  return (

    <View style={styles.contentCustomHeader}>

      <TouchableOpacity style={styles.contentBackIcon} onPress={handleGoBack}>
        <Ionicons style={styles.backIcon} name="arrow-back-outline" />
      </TouchableOpacity>

      <View style={styles.contentLogo}>
        <Image style={styles.logo} source={require('../../android/assets/img/logo.png')} />
      </View>

      <TouchableOpacity style={styles.contentAccountIcon} onPress={handleIconPress}>
        <Ionicons style={styles.accountIcon} name='settings-outline' />
      </TouchableOpacity>

    </View>

  );

};

export default CustomHeaderReturnLogo;

// ********** Estilos CSS **********
const styles = StyleSheet.create({
  contentCustomHeader: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff', // Superpone color "#ffffff" sobre el color por defecto
    elevation: 5, // Crea efecto boxshadow"
    marginBottom: 3, // Permite ver el efecto "boxshadow" de la propiedad "elevation:"
  },
  contentBackIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    width: 30,
    height: 30,
    zIndex: 1,
  },
  backIcon: {
    color: '#4e4e4e',
    fontSize: 24,
  },
  contentLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 60,
  },
  contentAccountIcon: {
    position: 'absolute',
    top: 24,
    right: 26,
    zIndex: 1,
  },
  accountIcon: {
    color: '#5B009D',
    fontSize: 24,
  },
});