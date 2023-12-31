import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LoadingIndicator from '../components/LoadingIndicator';
import HeaderLogoReturn from '../components/HeaderLogoReturn';
import ButtonSecondary from '../components/ButtonSecondary';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonPrimary from '../components/ButtonPrimary';
import AlertSuccess from '../components/AlertSuccess';
import AlertFailure from '../components/AlertFailure';
import AlertWarning from '../components/AlertWarning';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define el tipo para los datos de usuario logueado
type User = {
  _id: User | null;
  Nombre: string;
  Apellido: string;
  Documento: number;
};

// Define el tipo para los datos del servicio
type Service = {
  _id: string;
  Nombre: string;
  Tiempo: number;
};

type RootStackParamList = {
  AgendarCita: undefined;
  MisCitas: undefined;
  StackAccount: undefined;
};
type AgendarCitaProps = NativeStackScreenProps<RootStackParamList, 'AgendarCita'>;

const AgendarCita = ({ navigation }: AgendarCitaProps) => {

  const [user, setUser] = useState<User | null>(null);

  // -----------------------------------------------Indicador de carga "Preload"-----------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  // --------------------------------------------------------------------------------------------------------------------------

  // --------------------------------------------------Estado de los "Inputs"--------------------------------------------------
  const [Documento, setDocumento] = useState('');
  const [Nombre, setNombre] = useState('');
  const [Apellido, setApellido] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [FechaCita, setFechaCita] = useState(new Date());
  const [HoraCita, setHoraCita] = useState(new Date());
  const [Descripcion, setDescripcion] = useState('');

  // ---------------------------------------Función alerta Select "Seleccionar servicios"--------------------------------------
  const [selectServices, setSelectServices] = useState(false);

  const closeSelectServices = () => {
    setSelectServices(false);
    navigation.navigate('AgendarCita'); // Redireccionar a "AgendarCita"
    setIsLoading(false); // Desactivar el preload
  };

  // -------------------------------------------Función alerta "Servicio duplicado"--------------------------------------------
  const [duplicateService, setDuplicateService] = useState(false);

  const closeDuplicateService = () => {
    setDuplicateService(false);
    navigation.navigate('AgendarCita'); // Redireccionar a "AgendarCita"
    setIsLoading(false); // Desactivar el preload
  };

  // -----------------------------------------Función alerta select "Seleccionar Fecha"----------------------------------------
  const [selectDate, setSelectDate] = useState(false);

  const closeSelectDate = () => {
    setSelectDate(false);
    navigation.navigate('AgendarCita'); // Redireccionar a "AgendarCita"
    setIsLoading(false); // Desactivar el preload
  };

  // ----------------------------------------------Función alerta "Fecha inválida"---------------------------------------------
  const [invalidDate, setInvalidDate] = useState(false);

  const closeInvalidDate = () => {
    setInvalidDate(false);
    navigation.navigate('AgendarCita'); // Redireccionar a "AgendarCita"
    setIsLoading(false); // Desactivar el preload
  };

  // -----------------------------------------Función alerta select "Seleccionar Hora"-----------------------------------------
  const [selectTime, setSelectTime] = useState(false);

  const closeSelectTime = () => {
    setSelectTime(false);
    navigation.navigate('AgendarCita'); // Redireccionar a "AgendarCita"
    setIsLoading(false); // Desactivar el preload
  };

  // ---------------------------------------Función alerta "Campo Descripción requerido"---------------------------------------
  const [fieldDescriptionRequired, setFieldDescriptionRequired] = useState(false);

  const closefieldDescriptionRequired = () => {
    setFieldDescriptionRequired(false);
    navigation.navigate('AgendarCita'); // Redireccionar a "AgendarCita"
    setIsLoading(false); // Desactivar el preload
  };

  // ----------------------------------------Función alerta "Cita agendada con éxito"------------------------------------------
  const [createdAppointment, setCreatedAppointment] = useState(false);

  const closeCreatedAppointment = () => {
    setCreatedAppointment(false);
    navigation.navigate('MisCitas'); // Redirige a "MisCitas"
  };

  // --------------------------------------------Función alerta "Cuenta eliminada"---------------------------------------------
  const [deletedAccountVisible, setDeletedAccountVisible] = useState(false); // Estado de modal "AlertFailure"

  const handleCloseDeletedAccount = () => {
    setDeletedAccountVisible(false);
    navigation.navigate('StackAccount'); // Redireccionar a "StackAccount"
  };

  // --------------------------------------Función para mostrar datos de usuario logueado--------------------------------------
  useEffect(() => {
    const fetchUserData = async () => {

      try {
        const token = await AsyncStorage.getItem('userToken');
        const userEmail = await AsyncStorage.getItem('userEmail');

        if (token && userEmail) {
          const userResponse = await axios.get('https://api-proyecto-5hms.onrender.com/api/usuario', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = userResponse.data.Usuarios;
          const currentUser = userData.find((user: { Correo: string; }) => user.Correo === userEmail);

          if (currentUser) {
            setUser(currentUser);
            console.log('Datos del usuario obtenidos:', currentUser);

            // Inicializa estado de campos editables, con valores del usuario logueado, "Cambia estado de vacío a lleno"
            setNombre(currentUser.Nombre);
            setApellido(currentUser.Apellido);
            setDocumento(currentUser.Documento);

            setIsLoading(false); // Desactivar el preload

          } else {
            setDeletedAccountVisible(true);
            // Destruye la sesión y redirige al login
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userEmail');
          }
        } else {
          //setRequiredLoginVisible(true); // Mostrar alerta de "Inicio de sesión requerido"
        }

      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };
    fetchUserData();
  }, []);

  // ------------------------------------------Función mostrar lista de "Servicios"--------------------------------------------
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {

      try {
        const servicesResponse = await axios.get('https://api-proyecto-5hms.onrender.com/api/servicio'); // Obtiene todos los servicios
        const servicesFetched = servicesResponse.data.servicio;

        if (servicesFetched) {
          console.log('Servicios obtenidos:', servicesFetched);
          setServices(servicesFetched);
        } else {
          console.log('No se encontraron servicios.');
        }

      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      }
    };

    fetchServices();
  }, []);

  // ------------------------------------------Función modal "Seleccionar servicios"-------------------------------------------
  const [servicesAdded, setServicesAdded] = useState<string[]>([]); // Seguimiento de servicios seleccionados
  const [ServiceOptionsVisible, setServiceOptionsVisible] = useState(false);

  const handleOpenServiceOptions = () => {
    setServiceOptionsVisible(true);
  };

  const handleCloseServiceOptions = (value: string) => {
    if (servicesAdded.includes(value)) {
      setDuplicateService(true);
    } else {
      setSelectedServices((prevSelectedServices) => [...prevSelectedServices, value]);
      setServicesAdded((prevServicesAdded) => [...prevServicesAdded, value]);
    }
    setServiceOptionsVisible(false);
  };

  // Función para cerrar "Modal" desde botón
  const handleCloseServiceOptionsButton = () => {
    setServiceOptionsVisible(false);
  };

  // Función para remover servicios almacenados
  const handleRemoveService = (index: number) => {
    const removedService = selectedServices[index];
    const updatedServices = [...selectedServices];
    updatedServices.splice(index, 1);
    setSelectedServices(updatedServices);

    // Elimina el servicio de "servicesAdded"
    setServicesAdded((prevServicesAdded) =>
      prevServicesAdded.filter((service) => service !== removedService)
    );
  };

  // ------------------------------------------Función select Fecha "DateTimePicker"-------------------------------------------
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (_event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || FechaCita;
    setShowDatePicker(false);
    setFechaCita(currentDate);
    setHasSelectedDate(true); // Marcar que usuario ha interactuado con selector de Fecha.
  };

  // -------------------------------------------Función select Hora "DateTimePicker"-------------------------------------------
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeTime = (_event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || HoraCita;
    setShowTimePicker(false);
    setHoraCita(currentTime);
    setHasSelectedTime(true); // Marcar que usuario ha interactuado con selector de Hora.
  };

  // ---------------------------------------Función para formatear Fecha "DateTimePicker"--------------------------------------
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ---------------------------------------Función para formatear Hora "DateTimePicker"---------------------------------------
  const formatTime = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convertir a formato de 12 horas
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // ---------------------------------------------------Función crear "Cita"---------------------------------------------------
  const [hasSelectedDate, setHasSelectedDate] = useState(false);
  const [hasSelectedTime, setHasSelectedTime] = useState(false);

  const crearCita = async () => {

    setIsLoading(true); // Activar el preload

    const currentDate = new Date(); // Obtiene Fecha y Hora actuales
    const FechaActual = (currentDate); // Obtiene la Fecha actual 

    // Validar select "Seleccionar servicios"
    if (selectedServices.length === 0) {
      setSelectServices(true); // Mostrar alerta "Seleccióne un servicio"
      return;
    } else {
      console.log('Servicios seleccionados:', selectedServices);
    }

    // Validar select "Seleccionar Fecha"
    if (hasSelectedDate === false) {
      setSelectDate(true); // Mostrar alerta "Fecha requerida"
      return;
    } else {
      console.log('Fecha seleccionada:', formatDate(FechaCita));
    }

    // Validar que Fecha seleccionada no sea anterior a Fecha actual
    if (formatDate(FechaCita) < formatDate(FechaActual)) {
      setInvalidDate(true); // Mostrar alerta "Fecha inválida"
      return;
    } else {
      console.log('La fecha seleccionada es posterior a la fecha actual');
    }

    // Validar select "Seleccionar Hora"
    if (hasSelectedTime === false) {
      setSelectTime(true);
      return;
    } else {
      console.log('Hora seleccionada:', formatTime(HoraCita));
    }

    // Validar campo "Descripción"
    if (Descripcion === '') {
      setFieldDescriptionRequired(true);
      return;
    } else {
      console.log('Descripción establecida:', Descripcion);
    }

    // ------------------------Función para calcular "Horafin"-------------------------
    const Fincita = new Date(HoraCita);
    // Obtener tiempo de cada servicio seleccionado y sumarlo a "HoraFinal"
    selectedServices.forEach((selectedService) => {
      const service = services.find((service) => service.Nombre === selectedService);
      if (service) {
        Fincita.setMinutes(Fincita.getMinutes() + service.Tiempo);
      }
    });
    // --------------------------------------------------------------------------------

    // Formatear FechaCita en formato de 24 horas
    const formatFechaCita = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Formatear HoraCita en formato de 24 horas
    const formatHoraCita = (time: Date) => {
      const hours = time.getHours().toString().padStart(2, '0'); // Dos dígitos para las horas
      const minutes = time.getMinutes().toString().padStart(2, '0'); // Dos dígitos para los minutos
      return `${hours}:${minutes}`;
    };

    // Formatear Fincita en formato de 24 horas
    const formatFincita = (time: Date) => {
      const hours = time.getHours().toString().padStart(2, '0'); // Dos dígitos para las horas
      const minutes = time.getMinutes().toString().padStart(2, '0'); // Dos dígitos para los minutos
      return `${hours}:${minutes}`;
    };

    // Crea objeto "Servicios" a partir de "selectedServices"
    const Servicios = selectedServices.map((selectedServices) => ({
      Nombre: selectedServices,
    }));

    const nuevaCita = {
      Documento: Documento,
      Nombre: Nombre,
      Apellidos: Apellido,
      Servicios: Servicios,
      FechaCita: formatFechaCita(FechaCita),
      HoraCita: formatHoraCita(HoraCita),
      Fincita: formatFincita(Fincita),
      Descripcion: Descripcion,
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.post(`https://api-proyecto-5hms.onrender.com/api/cita`, nuevaCita, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Verificar que la respuesta del servidor sea exitosa
      if (response.status === 200) {
        setCreatedAppointment(true); // Mostrar alerta "Cita Agendada con éxito"

        // Limpiar los campos después de crear la "Cita"
        setSelectedServices([]);
        setServicesAdded([])
        setFechaCita(new Date());
        setHoraCita(new Date());
        setDescripcion('');

      } else {
        console.log('Error al crear la cita:');
        setIsLoading(false); // Desactivar el preload
      }

    } catch (error) {
      console.log('Error al crear la cita:', error);
      setIsLoading(false); // Desactivar el preload
    }
  };

  // --------------------------------------------------------------------------------------------------------------------------

  return (

    <View style={styles.generalContainer}>

      <LoadingIndicator isLoading={isLoading} />

      <HeaderLogoReturn navigation={navigation} title="Agendar cita" />

      {/* "keyboardShouldPersistTaps="always" evita que el teclado se oculte al hacer clic fuera del campo */}
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">

        <View style={styles.contentMain}>

          <SafeAreaView>

            {user ? (
              <>
                <View style={styles.fieldContainer}>
                  <View style={styles.iconLabelContainer}>
                    <Ionicons style={styles.iconForm} name='person-outline' />
                    <Text style={styles.label}>Nombre:</Text>
                  </View>
                  <Text style={styles.input}>{user.Nombre}</Text>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.iconLabelContainer}>
                    <Ionicons style={styles.iconForm} name='people-outline' />
                    <Text style={styles.label}>Apellidos:</Text>
                  </View>
                  <Text style={styles.input}>{user.Apellido}</Text>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.iconLabelContainer}>
                    <Ionicons style={styles.iconForm} name='id-card-outline' />
                    <Text style={styles.label}>Documento:</Text>
                  </View>
                  <Text style={styles.input}>{user.Documento}</Text>
                </View>
              </>
            ) : (<Text>No se encontró ningún usuario</Text>)}

            {/* --------------------Selector modal "Seleccionar servicios" y fecha y hora "DateTimePicker"------------------- */}
            <TouchableOpacity style={styles.containeSeletcServices} onPress={handleOpenServiceOptions}>
              <View style={styles.containerIconLabel}>
                <Ionicons style={[styles.iconServiceOptions, { transform: [{ rotate: '300deg' }] }]} name="cut-sharp" />
                <Text style={styles.labelServiceOptions}>Seleccionar servicios</Text>
              </View>
            </TouchableOpacity>

            {/* ----------------------------------------Modal "Seleccionar servicios"---------------------------------------- */}
            <Modal visible={ServiceOptionsVisible} animationType="fade" transparent>
              <View style={styles.containerServiceOptions}>

                <View style={styles.contentServiceOptions}>
                  <Text style={styles.titleSelectService}>Seleccione servicio</Text>
                  <ScrollView>
                    {services.map((service) => (
                      <TouchableOpacity
                        style={styles.containerRadioButton}
                        key={service._id}
                        onPress={() => handleCloseServiceOptions(service.Nombre)}>
                        <Text style={styles.serviceOptionText}>{service.Nombre}</Text>
                        <MaterialIcons name="radio-button-unchecked" color={'#f0f0f0'} size={18} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.containerButton}>
                    <TouchableOpacity style={styles.button} onPress={handleCloseServiceOptionsButton}>
                      <Text style={styles.buttonText}>SALIR</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </Modal>

            {/* ----------------------------------------Modal fecha "DateTimePicker"----------------------------------------- */}
            {showDatePicker && (
              <DateTimePicker style={{ width: 400 }}
                testID="dateTimePicker"
                value={FechaCita}
                mode="date"
                display="calendar"
                onChange={onChangeDate}
              />
            )}

            {/* -----------------------------------------Modal hora "DateTimePicker"----------------------------------------- */}
            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={HoraCita}
                mode="time"
                is24Hour={false}
                display="clock"
                onChange={onChangeTime}
              />
            )}

            {/* ------------------------------------------------------------------------------------------------------------- */}

            <View style={styles.containerDateTime}>
              <View style={[styles.containerTitleDateTime, { width: '42%' }]}>
                <Text style={styles.titleDateTime}>Fecha servicio</Text>
              </View>
              <View style={[styles.containerTextDateTime, { width: '58%' }]}>
                <Text style={styles.textDateTime}>{formatDate(FechaCita)}</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} >
                  <MaterialIcons style={styles.iconDateTime} name="calendar-month" size={28} color="#5B009D" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.containerDateTime}>
              <View style={[styles.containerTitleDateTime, { width: '42%' }]}>
                <Text style={styles.titleDateTime}>Hora servicio</Text>
              </View>
              <View style={[styles.containerTextDateTime, { width: '58%' }]}>
                <Text style={styles.textDateTime}>{formatTime(HoraCita)}</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}  >
                  <MaterialIcons style={styles.iconDateTime} name="access-time" size={28} color="#5B009D" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.containerServicesTitle}>
              <View style={[styles.containerTitle, { width: '13%', borderRightWidth: 1, borderColor: '#5f5f5f', }]}>
                <Text style={styles.title}>Id</Text>
              </View>
              <View style={[styles.containerTitle, { width: '87%', }]}>
                <Text style={styles.title}>Servicios seleccionados</Text>
              </View>
            </View>

            {selectedServices.map((service, index) => (
              <View style={styles.containerServicesText} key={index}>
                <View style={[styles.containerText, { width: '13%', borderRightWidth: 1, borderColor: '#3F3F3F', }]}>
                  <Text style={[styles.itemText, { textAlign: 'center', }]}>{index + 1}</Text>
                </View>
                <View style={[styles.containerText, { width: '75%', }]}>
                  <Text style={[styles.itemText, { paddingLeft: 10, }]}>{service}</Text>
                </View>
                <TouchableOpacity
                  style={styles.containerServiceIcon}
                  onPress={() => handleRemoveService(index)}
                >
                  <Ionicons style={styles.serviceIcon} name="trash-outline" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.containerServicesTitle}>
              <View style={[styles.containerTitle, { width: '100%', }]}>
                <Text style={styles.title}>Descripción</Text>
              </View>
            </View>

            <TextInput
              style={styles.inputDescription}
              onChangeText={setDescripcion}
              value={Descripcion}
              textAlignVertical='top' // Establece alineación vertical de texto en la parte superior
              multiline // Permite múltiples líneas
              maxLength={150} // Establece el máximo de caractéres
            />

            <ButtonPrimary
              onPress={crearCita}
              width={'100%'}
              height={45}
              marginTop={24}
              marginBottom={0}
              backgroundColor={'#5B009D'}
              borderRadius={0}
              fontFamily={'Aspira W05 Demi'}
              color={'#ffffff'}
              fontSize={15}
              fontWeight={undefined}
              letterSpacing={0.3}
              title={'AGENDAR'}
            />

            <ButtonSecondary
              onPress={() => navigation.navigate('MisCitas')}
              width={'100%'}
              height={45}
              marginTop={15}
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
              title={'MIS CITAS'}
            />

          </SafeAreaView>

          {/* -----------------------------------Alerta "Select "Seleccionar servicios"------------------------------------ */}
          <AlertWarning
            visible={selectServices}
            modalContentStyle={{ width: '70%' }}
            onCloseWarning={closeSelectServices}
            title='Seleccióne un servicio'
            message='Por favor, seleccione al menos un servicio'
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* -----------------------------------------Alerta "Servicio duplicado"----------------------------------------- */}
          <AlertWarning
            visible={duplicateService}
            modalContentStyle={{ width: '70%' }}
            onCloseWarning={closeDuplicateService}
            title='Servicio duplicado'
            message='No puede seleccionar dos veces el mismo servicio'
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* --------------------------------------Alerta select "Seleccionar Fecha"-------------------------------------- */}
          <AlertWarning
            visible={selectDate}
            modalContentStyle={{ width: '70%' }}
            onCloseWarning={closeSelectDate}
            title='Fecha requerida.'
            message='Por favor, seleccione la fecha del servicio'
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* -------------------------------------------Alerta "Fecha inválida"------------------------------------------- */}
          <AlertWarning
            visible={invalidDate}
            modalContentStyle={{ width: '70%' }}
            onCloseWarning={closeInvalidDate}
            title='Fecha Inválida.'
            message='La fecha seleccionada, no puede ser anterior a la fecha actual'
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* ---------------------------------------Alerta select "Seleccionar Hora"-------------------------------------- */}
          <AlertWarning
            visible={selectTime}
            modalContentStyle={{ width: '70%' }}
            onCloseWarning={closeSelectTime}
            title='Hora requerida'
            message='Por favor, seleccione la hora del servicio'
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* ------------------------------------Alerta "Campo Descripción requerido"------------------------------------- */}
          <AlertWarning
            visible={fieldDescriptionRequired}
            modalContentStyle={{ width: '75%' }}
            onCloseWarning={closefieldDescriptionRequired}
            title='Campo requerido'
            message={
              <Text>El campo <Text style={{ fontWeight: 'bold', color: '#ca0000', }}>Descripción</Text> es oblogatorio.</Text>
            }
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* --------------------------------------Alerta "Cita Agendada con éxito"--------------------------------------- */}
          <AlertSuccess
            visible={createdAppointment}
            onCloseSuccess={closeCreatedAppointment}
            title='Cita agendada'
            message='La cita se ha agendado exitosamente.'
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* ------------------------------------------Alerta "Cuenta eliminada"------------------------------------------ */}
          <AlertFailure
            visible={deletedAccountVisible}
            onCloseFailure={handleCloseDeletedAccount}
            title='Usuario no encontrado.'
            message={`No pudimos encontrar la cuenta.\nContacte al administrador.`}
            buttonStyle={{ width: 70 }}
            buttonText='OK'
          />

          {/* ------------------------------------------------------------------------------------------------------------- */}

        </View>
      </ScrollView>
    </View>
  );
};

export default AgendarCita;

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
    marginTop: 24,
    marginHorizontal: '7%',
    backgroundColor: '#ffffff',
  },
  fieldContainer: {
    flexDirection: 'row',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#5f5f5f',
  },
  iconLabelContainer: {
    flexDirection: 'row',
    width: '46%',
    height: 45,
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
  },
  iconForm: {
    marginLeft: 6,
    marginRight: 4,
    fontSize: 22,
    color: '#000000',
  },
  label: {
    fontFamily: 'Aspira W05 Medium',
    fontSize: 15,
    color: '#000000',
    letterSpacing: 0.3,
  },
  input: {
    fontFamily: 'Aspira W05 Medium',
    width: '54%',
    height: 45,
    paddingLeft: 10,
    fontSize: 15,
    color: '#000000',
    verticalAlign: 'middle',
    fontWeight: '400',
    borderLeftWidth: 1,
    borderColor: '#5f5f5f',
    letterSpacing: 0.3,
  },
  // Estilos botón "Seleccionar sevicios"
  containeSeletcServices: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: 24,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#5f5f5f',
  },
  containerIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconServiceOptions: {
    marginLeft: 8,
    marginRight: 3,
    fontSize: 26,
    color: '#5B009D',
  },
  labelServiceOptions: {
    fontFamily: 'Aspira W05 Demi',
    fontSize: 16,
    color: '#000000',
    letterSpacing: 0.3,
  },
  // Estilos modal "Seleccionar sevicios"
  containerServiceOptions: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff80',
  },
  contentServiceOptions: {
    width: '75%',
    height: 325,
    backgroundColor: '#3F3F3F',
    borderRadius: 8,
  },
  titleSelectService: {
    fontFamily: 'Aspira W05 Medium',
    paddingVertical: 18,
    fontSize: 18,
    color: '#f0f0f0',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  containerRadioButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
  },
  serviceOptionText: {
    fontFamily: 'Aspira W05 Medium',
    fontSize: 15,
    color: '#f0f0f0',
    letterSpacing: 0.3,
  },
  containerButton: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#7066e0',
    borderColor: '#b2abff',
    borderWidth: 3,
  },
  buttonText: {
    fontFamily: 'Montserrat Medium',
    height: 34,
    paddingHorizontal: 18,
    fontSize: 16,
    color: 'white',
    verticalAlign: 'middle',
    letterSpacing: 0.3,
  },
  // Estilos modal "Seleccionar sevicios" Fin
  containerDateTime: {
    flexDirection: 'row',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#5f5f5f',
  },
  containerTitleDateTime: {
    justifyContent: 'center',
    height: 45,
    backgroundColor: '#E6E6E6',
  },
  titleDateTime: {
    fontFamily: 'Aspira W05 Medium',
    fontSize: 15,
    color: '#000000',
    paddingLeft: 10,
    letterSpacing: 0.3,
  },
  containerTextDateTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    borderLeftWidth: 1,
    borderColor: '#5f5f5f',
  },
  textDateTime: {
    fontFamily: 'Aspira W05 Medium',
    width: '75%',
    paddingLeft: 10,
    fontSize: 15,
    color: '#000000',
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  // Estilos selectores fecha y hora "DateTimePicker"
  iconDateTime: {
    paddingRight: 10,
  },
  containerServicesTitle: {
    flexDirection: 'row',
    marginTop: 6,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#5f5f5f',
  },
  containerTitle: {
    height: 45,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Aspira W05 Demi',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  containerServicesText: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#5f5f5f',
  },
  containerText: {
    height: 45,
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: 'Aspira W05 Medium',
    fontSize: 15,
    color: '#000000',
    letterSpacing: 0.3,
  },
  containerServiceIcon: {
    width: '12%',
    height: 45,
    justifyContent: 'center',
  },
  serviceIcon: {
    fontSize: 22,
    color: '#585858',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  inputDescription: {
    fontFamily: 'Aspira W05 Medium',
    minHeight: 45,
    maxHeight: 94,
    paddingTop: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#000000',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: '#5f5f5f',
    letterSpacing: 0.3,
  },
});
