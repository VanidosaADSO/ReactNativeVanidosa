import { SafeAreaView, StyleSheet, TextInput, View, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LoadingIndicator from '../components/LoadingIndicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonPrimary from '../components/ButtonPrimary';
import AlertWarning from '../components/AlertWarning';
import HeaderReturn from '../components/HeaderReturn';
import React, { useEffect, useState } from 'react';
import SendEmail from '../components/SendEmail';

type RootStackParamList = {
  Login: undefined;
  InputEmail: undefined;
  RecoverPass: undefined;
};
type InputEmailProps = NativeStackScreenProps<RootStackParamList, 'InputEmail'>;

const InputEmail = ({ navigation }: InputEmailProps) => {

  // -----------------------------------------------Indicador de caega "Preload"-----------------------------------------------
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Ocultar el "preload" después de completar la carga o el proceso
    }, 800); // Tiempo de carga simulado (en milisegundos)
  }, []);

  // --------------------------------------------------Estado de los "Inputs"--------------------------------------------------
  const [email, setEmail] = useState('');

  // ---------------------------------------------Función alerta "Campo requerido"---------------------------------------------
  const [emptyInputVisible, setEmptyInputVisible] = useState(false);

  const handleCloseEmptyInput = () => {
    setEmptyInputVisible(false);
  };

  // --------------------------------------------Función alerta "Correo enviado"-----------------------------------------------
  const [SuccessSendEmailVisible, setSuccessSendEmailVisible] = useState(false);

  const handleCloseSuccessSendEmail = () => {
    setSuccessSendEmailVisible(false);
    navigation.replace('Login'); // 'replace' en lugar de 'navigate' recarga la "Vista" y actualiza cambios
  };

  // --------------------------Función con "axios" para enviar "Correo de recuperación de contraseña"--------------------------
  // const handleResetPassword = async () => {

  //   // Validación de campos vacíos
  //   if (email === '') {
  //     setEmptyInputVisible(true); // Muestra alerta de "Campos vacíos"
  //     return
  //   }

  //   try {
  //     const response = await axios.post('https://api-proyecto-5hms.onrender.com/api/olvidocontrasena', {
  //       Correo: email,
  //     });

  //     if (response.status === 200) {
  //       setSuccessSendEmailVisible(true);
  //     } else {
  //       Alert.alert('Hubo un error al enviar el correo');
  //     }
  //   } catch (error) {
  //     console.error('Error al enviar la solicitud:', error);
  //     Alert.alert('Hubo un error al enviar la solicitud');
  //   }
  // };
  // --------------------------------------------------------------------------------------------------------------------------

  // ---------------------------Función con fetch para enviar "Correo de recuperación de contraseña"---------------------------
  const handleResetPassword = async () => {

    // Validación de campos vacíos
    if (email === '') {
      setEmptyInputVisible(true); // Muestra alerta de "Campos vacíos"
      return
    }

    try {
      const response = await fetch('https://api-proyecto-5hms.onrender.com/api/olvidocontrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: email,
        }),
      });

      if (response.status === 200) {
        setSuccessSendEmailVisible(true);
      } else {
        Alert.alert('Hubo un error al enviar el correo');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      Alert.alert('Hubo un error al enviar la solicitud');
    }
  };
  // --------------------------------------------------------------------------------------------------------------------------

  return (

    <View style={styles.generalContainer}>

      <LoadingIndicator isLoading={isLoading} />

      <HeaderReturn navigation={navigation} title="Restablecer contraseña" />

      {/* "keyboardShouldPersistTaps="always" evita que el teclado se oculte al hacer clic fuera del campo */}
      <View style={styles.scrollView}>

        <View style={styles.contentMain}>

          <View style={styles.contentLogoAccount}>
            <Image style={styles.logoAccount} source={require('../../android/assets/img/logo.png')} />
          </View>

          <SafeAreaView>

            <View>
              <Ionicons style={styles.iconForm} name='at-outline' />
              <TextInput
                style={styles.input}
                placeholder='Ingrese E-mail para continuar'
                placeholderTextColor='#000000'
                // textAlignVertical='bottom'
                onChangeText={setEmail}
                value={email}
                autoCapitalize='none' // Evita que la primera letra ingresada sea mayúscula
                keyboardType='email-address' />
            </View>

            <View style={styles.separator}></View>

            <ButtonPrimary
              onPress={handleResetPassword}
              width={'100%'}
              height={48}
              marginTop={0}
              marginBottom={30}
              backgroundColor={'#5B009D'}
              borderRadius={0}
              fontFamily={'Aspira W05 Demi'}
              color={'#ffffff'}
              fontSize={15}
              fontWeight={undefined}
              letterSpacing={0.3}
              title={'ENVIAR'}
            />

            {/* ------------------------------------------Alerta "Campo requerido"------------------------------------------- */}
            <AlertWarning
              visible={emptyInputVisible}
              onCloseWarning={handleCloseEmptyInput}
              title='Campo requerido.'
              message='Por favor, ingrese el correo electrónico para continuar.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />

            {/* ------------------------------------------Alerta "Correo enviado"-------------------------------------------- */}
            <SendEmail
              visible={SuccessSendEmailVisible}
              onCloseSuccess={handleCloseSuccessSendEmail}
              title='Correo enviado.'
              message={'Se ha enviado un enlace de recuperación de contraseña a:'}
              email={`${email}`}
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />

            {/* ------------------------------------------------------------------------------------------------------------- */}

          </SafeAreaView>
        </View>
      </View>
    </View>
  );
};

export default InputEmail;

// ********** Estilos CSS **********
const styles = StyleSheet.create({
  generalContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  contentMain: {
    width: '86%',
    marginHorizontal: '7%',
    backgroundColor: '#ffffff',
  },
  contentLogoAccount: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#ffffff',
  },
  logoAccount: {
    width: 120,
    height: 72,
  },
  iconForm: {
    fontSize: 20,
    position: 'absolute',
    top: 21,
    left: 6,
    color: '#000000',
    zIndex: 1,
  },
  input: {
    height: 48,
    marginVertical: 8,
    paddingLeft: 32,
    backgroundColor: '#e6e6e6',
    color: '#000000',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  separator: {
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    marginTop: 12,
    marginBottom: 20,
  },
});
