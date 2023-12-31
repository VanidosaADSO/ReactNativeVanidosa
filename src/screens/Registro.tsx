import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TermsAndConditionsModal from '../components/TermsAndConditionsModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LoadingIndicator from '../components/LoadingIndicator';
import HeaderLogoReturn from '../components/HeaderLogoReturn';
import ButtonSecondary from '../components/ButtonSecondary';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonPrimary from '../components/ButtonPrimary';
import CheckBox from '@react-native-community/checkbox';
import AlertSuccess from '../components/AlertSuccess';
import AlertWarning from '../components/AlertWarning';
import AlertFailure from '../components/AlertFailure';
import React, { useEffect, useState } from 'react';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';

type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  AccountHeader: undefined;
};
type RegistroProps = NativeStackScreenProps<RootStackParamList, 'Registro'>;

const Registro = ({ navigation }: RegistroProps) => {

  // -----------------------------------------------Indicador de caega "Preload"-----------------------------------------------
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Ocultar el "preload" después de completar la carga o el proceso
    }, 800); // Tiempo de carga simulado (en milisegundos)
  }, []);

  // --------------------------------------------------Estado de los "Inputs"--------------------------------------------------
  const [Nombre, setNombre] = useState('');
  const [Apellido, setApellido] = useState('');
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState('');
  const [Documento, setDocumento] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [Correo, setCorreo] = useState('');
  const [Contrasena, setContrasena] = useState('');
  const [ConfirmarContrasena, setConfirmarContrasena] = useState('');

  // -------------------------------------Lógica "Imput Select Modal" "Tipo de documento"--------------------------------------
  const tipoDocumentoOptions = [
    { label: 'Cédula de extranjería', value: 'Cédula de extranjería' },
    { label: 'Cédula de ciudadanía', value: 'Cédula de ciudadanía' },
    { label: 'Tarjeta de identidad', value: 'Tarjeta de identidad' },
  ];

  const [selectModalVisible, setSelectModalVisible] = useState(false);

  const handleOpenSelectModal = () => {
    setSelectModalVisible(true);
  };


  // Función para cerrar "Modal" al hacer clic fuera de él
  const handleSelectTipoDocumentoOutside = () => {
    setSelectModalVisible(false);
  };

  const handleSelectTipoDocumento = (value: string) => {
    setSelectedTipoDocumento(value);
    setTimeout(() => {
      setSelectModalVisible(false);
    }, 200); // Cambia el valor a la cantidad de milisegundos que deseas esperar antes de ocultar el modal
  };

  // ----------------------------------------------Mostrar y ocultar "Contraseña"----------------------------------------------
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  // ------------------------Controla la visibilidad del "Modal" en función del valor de "acceptTerms"-------------------------
  const [modalVisible, setModalVisible] = useState(false); // Estado modal "Política de privacidad, Términos y condiciones"
  const [acceptTerms, setacceptTerms] = useState(false) // Estado CheckBox "Política de privacidad, Términos y condiciones"

  const handleAcceptTerms = () => {
    setacceptTerms(!acceptTerms);
  };

  useEffect(() => {
    if (acceptTerms) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [acceptTerms]);

  // -------------------------------------Funcion para validar si el "Documento" ya existe"------------------------------------
  const getUserDocument = async (Documento: number) => {

    setIsLoading(true); // Activar el preload

    const response = await axios.get('https://api-proyecto-5hms.onrender.com/api/usuario');
    const { Usuarios } = response.data;

    // Encuentra el usuario con el correo proporcionado
    const user = Usuarios.find((usuario: { Documento: number; }) => usuario.Documento === Documento);

    if (user) {
      return user.Estado;
    } else {
      return null; // El usuario no existe
    }
  };

  // --------------------------------------Funcion para validar si el "Correo" ya existe"--------------------------------------
  const getUserState = async (Correo: string) => {

    setIsLoading(true); // Activar el preload

    const response = await axios.get('https://api-proyecto-5hms.onrender.com/api/usuario');
    const { Usuarios } = response.data;

    // Encuentra el usuario con el correo proporcionado
    const user = Usuarios.find((usuario: { Correo: string; }) => usuario.Correo === Correo);

    if (user) {
      return user.Estado;
    } else {
      return null; // El usuario no existe
    }
  };

  // --------------------------------------------------Función de (Registro)---------------------------------------------------
  const handleRegister = async () => {

    // Validar campos vacíos
    if (!Nombre || !Apellido || !Documento || !Direccion || !Telefono || !Correo || !Contrasena || !ConfirmarContrasena) {
      setEmptyFieldsVisible(true); // Mostrar alerta "Campos vacíos"
      return
    }

    // Validar select "Tipo de documento"
    else if (!selectedTipoDocumento) {
      setDocumentTypeVisible(true); // Mostrar alerta "Tipo de documento"
      return
    }

    // Validar cantidad mínima de digitos del "Documento"
    if (!/^\d{8,}$/.test(Documento)) {
      setDocumentVisible(true);
      return
    }

    // Validar cantidad mínima de digitos del "Teléfono"
    if (!/^\d{10,}$/.test(Telefono)) {
      setPhoneVisible(true);
      return
    }

    // Validar formato de "Correo electrónico"
    if (!/^[a-zA-Z0-9._-]+@(yahoo|outlook|hotmail|gmail|mailbox)\.(com|es|net|co)$/.test(Correo)) {
      setEmailVisible(true);
      return;
    }

    // Validar cantidad mínima de carácteres de la "Contraseña"
    if (Contrasena.length < 8) {
      setMinPasswordVisible(true);
      return
    }

    // Validar que las contraseñas coincidan
    if (Contrasena !== ConfirmarContrasena) {
      setNotMatchVisible(true); // Mostrar alerta "Las contraseñas no coinciden"
      return;
    }

    // Validar aceptación de "Términos y condiciones"
    if (!acceptTerms) {
      setAcceptTermsVisible(true);
      return;
    }

    // Validar si el documento ya existe
    const userStateDocument = await getUserDocument(parseInt(Documento, 10)); // Obtener el documento antes del registro
    if (userStateDocument === true) {
      setExistingDocumentVisible(true);
      return;
    }

    // Validar si el correo ya existe
    const userState = await getUserState(Correo); // Obtener el correo antes del registro
    if (userState === true) {
      setExistingEmailVisible(true);
      return;
    }

    try {
      // Crear un objeto con los datos del formulario
      const userData = {
        Rol: 'Cliente',
        Nombre,
        Apellido,
        Tipo_Documento: selectedTipoDocumento,
        Documento,
        Direccion,
        Telefono,
        Correo,
        Contrasena,
        ConfirmarContrasena,
      };

      // Enviar los datos a la API utilizando axios
      const response = await axios.post('https://api-proyecto-5hms.onrender.com/api/usuario', userData);
      console.log("Respuesta:", response.data);

      setRegisteredVisible(true); // Mostrar alerta "Registro exitoso."

    } catch (error) {
      setFailedRegisterVisible(true); // Mostrar alerta "Error de Registro."
    }
  };

  // ----------------------------------------------Función alerta "Campos vacíos"----------------------------------------------
  const [emptyFieldsVisible, setEmptyFieldsVisible] = useState(false);

  const handleCloseEmptyFields = () => {
    setEmptyFieldsVisible(false);
  };

  // --------------------------------------------Función alerta "Tipo de documento"--------------------------------------------
  const [documentTypeVisible, setDocumentTypeVisible] = useState(false);

  const handleCloseDocumentType = () => {
    setDocumentTypeVisible(false);
  };

  // --------------------------------------------Función alerta "Documento inválido"-------------------------------------------
  const [documentVisible, setDocumentVisible] = useState(false);

  const handleCloseDocument = () => {
    setDocumentVisible(false);
  };

  // --------------------------------------------Función alerta "Teléfono inválido"--------------------------------------------
  const [phoneVisible, setPhoneVisible] = useState(false);

  const handleClosePhone = () => {
    setPhoneVisible(false);
  };

  // ---------------------------------------------Función alerta "Correo inválido"---------------------------------------------
  const [emailVisible, setEmailVisible] = useState(false);

  const handleCloseEmail = () => {
    setEmailVisible(false);
  };

  // -------------------------------------------Función alerta "Contraseña inválida"-------------------------------------------
  const [minPasswordVisible, setMinPasswordVisible] = useState(false);

  const handleCloseMinPassword = () => {
    setMinPasswordVisible(false);
  };

  // ---------------------------------------Función alerta "Las contraseñas no coinciden"--------------------------------------
  const [notMatchVisible, setNotMatchVisible] = useState(false);

  const handleCloseNotMatch = () => {
    setNotMatchVisible(false);
  };

  // ------------------------------------------Función alerta "El documento ya existe"-----------------------------------------
  const [existingDocumentVisible, setExistingDocumentVisible] = useState(false);

  const handleCloseExistingDocument = () => {
    setExistingDocumentVisible(false);
    setIsLoading(false);
  };

  // --------------------------------------------Función alerta "El correo ya existe"------------------------------------------
  const [existingEmailVisible, setExistingEmailVisible] = useState(false);

  const handleCloseExistingEmail = () => {
    setExistingEmailVisible(false);
    setIsLoading(false);
  };

  // ------------------------------------------Función alerta "Términos y condiciones"-----------------------------------------
  const [acceptTermsVisible, setAcceptTermsVisible] = useState(false);

  const handleCloseAcceptTerms = () => {
    setAcceptTermsVisible(false);
  };

  // --------------------------------------------Función alerta "Error de registro"--------------------------------------------
  const [failedRegisterVisible, setFailedRegisterVisible] = useState(false);

  const handleCloseFailedRegister = () => {
    setFailedRegisterVisible(false);
  };

  // --------------------------------------------Función alerta "Registro exitoso"---------------------------------------------
  const [registeredVisible, setRegisteredVisible] = useState(false);

  const handleCloseRegistered = () => {
    setRegisteredVisible(false);
    navigation.replace('Login');
  };
  // --------------------------------------------------------------------------------------------------------------------------

  return (
    <View style={styles.generalContainer}>

      <LoadingIndicator isLoading={isLoading} />

      <HeaderLogoReturn navigation={navigation} title="Registro" />

      {/* "keyboardShouldPersistTaps="always" evita que el teclado se oculte al hacer clic fuera del campo */}
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">

        <View style={styles.contentMain}>

          <SafeAreaView>

            <View>
              <Ionicons style={styles.iconForm} name='person-outline' />
              <TextInput
                style={styles.input}
                placeholder='Nombre'
                placeholderTextColor='#000000'
                onChangeText={setNombre}
                value={Nombre}
                autoCapitalize="words" // Activa mayúscula inicial para cada palabra
              />
            </View>

            <View>
              <Ionicons style={styles.iconForm} name='people-outline' />
              <TextInput
                style={styles.input}
                placeholder='Apellidos'
                placeholderTextColor='#000000'
                onChangeText={setApellido}
                value={Apellido}
                autoCapitalize="words" // Activa mayúscula inicial para cada palabra
              />
            </View>

            {/* ------------------------------------------Campo "Tipo de documento"------------------------------------------ */}
            <TouchableOpacity style={styles.selectInputContainer} onPress={handleOpenSelectModal}>
              <Ionicons style={styles.selectIconForm} name="card-outline" />
              <Text style={styles.selectInput}>{selectedTipoDocumento ? selectedTipoDocumento : 'Tipo de documento'}</Text>
            </TouchableOpacity>

            {/* -------------------------------------"Modal" opciones "Tipo de documento"------------------------------------ */}
            <Modal
              visible={selectModalVisible}
              animationType="fade"
              transparent={true}
            >

              <Pressable
                style={styles.selectModalContainer}
                onPress={handleSelectTipoDocumentoOutside} // Cerrar "Modal" al hacer clic fuera de él 
              >

                <View style={styles.selectModalContent}>
                  <Text style={styles.modalTitle}>Seleccione tipo de documento</Text>
                  {tipoDocumentoOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.selectOption}
                      onPress={() => handleSelectTipoDocumento(option.value)}
                    >
                      <Text style={styles.selectOptionText}>{option.label}</Text>
                      <RadioButton
                        value={option.value}
                        status={selectedTipoDocumento === option.value ? 'checked' : 'unchecked'}
                        onPress={() => handleSelectTipoDocumento(option.value)}
                        uncheckedColor='#FFFFFF'
                        color='#E00083'
                      />
                    </TouchableOpacity>
                  ))}
                </View>

              </Pressable>

            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------- */}

            <View>
              <Ionicons style={styles.iconForm} name='id-card-outline' />
              <TextInput
                style={styles.input}
                placeholder='Documento'
                placeholderTextColor='#000000'
                onChangeText={(text) => {
                  // Validación para campo númerico
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setDocumento(numericValue);
                }}
                value={Documento}
                keyboardType='numeric'
              />
            </View>

            <View>
              <Ionicons style={styles.iconForm} name='home-outline' />
              <TextInput
                style={styles.input}
                placeholder='Dirección'
                placeholderTextColor='#000000'
                onChangeText={setDireccion}
                value={Direccion}
              />
            </View>

            <View>
              <Ionicons style={styles.iconForm} name='call-outline' />
              <TextInput
                style={styles.input}
                placeholder='Teléfono'
                placeholderTextColor='#000000'
                onChangeText={(text) => {
                  // Validación para campo númerico
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setTelefono(numericValue);
                }}
                value={Telefono}
                keyboardType='numeric'
              />
            </View>

            <View>
              <Ionicons style={styles.iconForm} name='at-sharp' />
              <TextInput
                style={styles.input}
                placeholder='E-mail'
                placeholderTextColor='#000000'
                onChangeText={setCorreo}
                value={Correo}
                autoCapitalize='none' // Evita que la primera letra ingresada sea mayúscula
                keyboardType='email-address'
              />
            </View>

            <View>
              <Ionicons style={styles.iconForm} name='key-outline' />
              <TextInput
                style={styles.input}
                placeholder='Contraseña'
                placeholderTextColor='#000000'
                onChangeText={setContrasena}
                value={Contrasena}
                autoCapitalize='none' // Evita que la primera letra ingresada sea mayúscula
                secureTextEntry={!showPassword1} // Oculta y muestra carácteres de contraseña
              />
              {Contrasena !== '' && ( // Código cambio de icono de la contraseña
                <TouchableOpacity style={styles.contentIconFormRight} onPress={togglePasswordVisibility1}>
                  <Ionicons style={styles.iconFormRight} name={showPassword1 ? 'eye-off-sharp' : 'eye-sharp'} />
                </TouchableOpacity>
              )}
            </View>

            <View>
              <Ionicons style={styles.iconForm} name='key-outline' />
              <TextInput
                style={styles.input}
                placeholder='Confirmar contraseña'
                placeholderTextColor='#000000'
                onChangeText={setConfirmarContrasena}
                value={ConfirmarContrasena}
                autoCapitalize='none' // Evita que la primera letra ingresada sea mayúscula
                secureTextEntry={!showPassword2} // Oculta y muestra carácteres de contraseña
              />
              {ConfirmarContrasena !== '' && ( // Código cambio de icono de la contraseña
                <TouchableOpacity style={styles.contentIconFormRight} onPress={togglePasswordVisibility2}>
                  <Ionicons style={styles.iconFormRight} name={showPassword2 ? 'eye-off-sharp' : 'eye-sharp'} />
                </TouchableOpacity>
              )}
            </View>

            {/* ----------------------------Código "CheckBox" "Política de privacidad y Términos"---------------------------- */}
            <View style={styles.checkboxAcceptTerms}>
              <CheckBox
                disabled={false}
                value={acceptTerms}
                onValueChange={handleAcceptTerms}
                tintColors={{ true: '#5B009D', false: '#7e7e7e' }} />
              <View style={styles.containerAcceptTerms}>

                <View style={styles.contentAcceptTerms}>
                  <Text style={styles.acceptTermsText}>He leído y acepto la </Text>
                  <Text style={styles.textTermsConditions}>Política de Privacidad</Text>
                </View>

                <View style={styles.contentAcceptTerms}>
                  <Text style={styles.acceptTermsText}>y </Text>
                  <Text style={styles.textTermsConditions}>Términos y Condiciones</Text>
                </View>

              </View>
            </View>
            {/* ------------------------------------------------------------------------------------------------------------- */}

            <TermsAndConditionsModal modalVisible={modalVisible} setModalVisible={setModalVisible} />

            <ButtonPrimary
              onPress={handleRegister}
              width={'100%'}
              height={48}
              marginTop={30}
              marginBottom={0}
              backgroundColor={'#5B009D'}
              borderRadius={0}
              fontFamily={'Aspira W05 Demi'}
              color={'#FFFFFF'}
              fontSize={15}
              fontWeight={undefined}
              letterSpacing={0.3}
              title={'CREAR CUENTA'}
            />

            {/* -------------------------------------------Alerta "Campos vacíos"-------------------------------------------- */}
            <AlertWarning
              visible={emptyFieldsVisible}
              onCloseWarning={handleCloseEmptyFields}
              title='Campos vacíos.'
              message='Por favor, complete todos los campos.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* -----------------------------------------Alerta "Tipo de documento"------------------------------------------ */}
            <AlertWarning
              visible={documentTypeVisible}
              onCloseWarning={handleCloseDocumentType}
              title='Tipo de documento.'
              message='Seleccione el tipo de documento.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ----------------------------------------Alerta "Documento inválido"------------------------------------------ */}
            <AlertWarning
              visible={documentVisible}
              onCloseWarning={handleCloseDocument}
              title='Documento inválido.'
              message='El número de documento debe contener al menos 8 dígitos.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* -----------------------------------------Alerta "Teléfono inválido"------------------------------------------ */}
            <AlertWarning
              visible={phoneVisible}
              onCloseWarning={handleClosePhone}
              title='Teléfono inválido.'
              message='El número de teléfono debe contener al menos 10 dígitos.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ------------------------------------------Alerta "Correo inválido"------------------------------------------- */}
            <AlertWarning
              visible={emailVisible}
              onCloseWarning={handleCloseEmail}
              title='Correo inválido.'
              message='El correo ingresado tiene un formato invalido.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ----------------------------------------Alerta "Contraseña inválida"----------------------------------------- */}
            <AlertWarning
              visible={minPasswordVisible}
              onCloseWarning={handleCloseMinPassword}
              title='Contraseña inválida.'
              message='La contraseña debe contener al menos 8 caractéres.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ------------------------------------Alerta "Las contraseñas no coinciden"------------------------------------ */}
            <AlertWarning
              visible={notMatchVisible}
              onCloseWarning={handleCloseNotMatch}
              title='Las contraseñas no coinciden.'
              message='Las contraseñas ingresadas deben coincidir.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ---------------------------------------Alerta "El documento ya exixte"--------------------------------------- */}
            <AlertWarning
              visible={existingDocumentVisible}
              onCloseWarning={handleCloseExistingDocument}
              title='El documento ya existe.'
              message='Ya existe una cuenta con este número de documento.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ----------------------------------------Alerta "El correo ya exixte"----------------------------------------- */}
            <AlertWarning
              visible={existingEmailVisible}
              onCloseWarning={handleCloseExistingEmail}
              title='El correo ya existe.'
              message='Ya existe una cuenta con esta dirección de correo electrónico.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* --------------------------------------Alerta "Términos y condiciones"---------------------------------------- */}
            <AlertWarning
              visible={acceptTermsVisible}
              onCloseWarning={handleCloseAcceptTerms}
              title='Términos y condiciones.'
              message='Debe aceptar los términos y condiciones para continuar con el registro.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* -----------------------------------------Alerta "Error de registro"------------------------------------------ */}
            <AlertFailure
              visible={failedRegisterVisible}
              onCloseFailure={handleCloseFailedRegister}
              title='Error de registro.'
              message='El registro no se pudo completar debido a un error.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ------------------------------------------Alerta "Registro exitoso"------------------------------------------ */}
            <AlertSuccess
              visible={registeredVisible}
              onCloseSuccess={handleCloseRegistered}
              title='Registro exitoso.'
              message='La cuenta se ha creado exitosamente.'
              buttonStyle={{ width: 70 }}
              buttonText='OK'
            />
            {/* ------------------------------------------------------------------------------------------------------------- */}

            <View style={styles.separator}></View>

            <ButtonSecondary
              onPress={() => navigation.navigate('Login')}
              width={'100%'}
              height={48}
              marginTop={0}
              marginBottom={30}
              backgroundColor={'#00000000'}
              borderColor={'#E00083'}
              borderWidth={2}
              borderRadius={0}
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              borderBottomLeftRadius={0}
              fontFamily={'Aspira W05 Demi'}
              color={'#29344A'}
              fontSize={15}
              fontWeight={undefined}
              letterSpacing={0.3}
              title={'INICIAR SESIÓN'}
            />

          </SafeAreaView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Registro;

// ********** Estilos CSS **********
const styles = StyleSheet.create({
  generalContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  contentMain: {
    width: '86%',
    marginTop: 30,
    marginHorizontal: '7%',
    backgroundColor: '#ffffff',
  },
  contentLogoAccount: {
    marginVertical: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#E6E6E6',
    color: '#000000',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  contentIconFormRight: {
    position: 'absolute',
    top: 12,
    right: 2,
    padding: 10,
  },
  iconFormRight: {
    fontSize: 22,
    color: '#4E4E4E',
  },
  separator: {
    borderColor: '#D3D3D3',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  checkboxAcceptTerms: {
    flexDirection: 'row',
    marginTop: 10,
  },
  containerAcceptTerms: {
    marginLeft: 10,
  },
  contentAcceptTerms: {
    flexDirection: 'row',
  },
  acceptTermsText: {
    color: '#4E4E4E',
  },
  textTermsConditions: {
    color: '#5B009D',
  },
  // Estilos "Input Select" "Tipo de documento"
  selectInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    height: 48,
    backgroundColor: '#E6E6E6',
    borderRadius: 5,
  },
  selectIconForm: {
    position: 'absolute',
    top: 13,
    left: 6,
    color: '#000000',
    fontSize: 20,
  },
  selectInput: {
    paddingLeft: 32,
    color: '#000000',
  },
  // Estilos "Modal" "Seleccione Tipo de documento"
  selectModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  selectModalContent: {
    width: '80%',
    backgroundColor: '#3F3F3F',
    borderRadius: 5,
  },
  modalTitle: {
    fontFamily: 'Aspira W05 Medium',
    paddingVertical: 18,
    fontSize: 18,
    color: '#f0f0f0',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  selectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderColor: '#7A7A7A'
  },
  selectOptionText: {
    fontFamily: 'Aspira W05 Medium',
    color: '#f0f0f0',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});