import { Modal, View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

interface AlertSendEmailProps {
  visible: boolean;
  onCloseSuccess: () => void;
  title: string;
  message: string;
  email: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonText: string;
}

const AlertSendEmail = ({ visible, onCloseSuccess, title, message, email, buttonStyle, buttonText }: AlertSendEmailProps) => {

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <View style={styles.containerAlertIcon}>
            <Ionicons style={styles.alertIcon} name="checkmark-circle-outline" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.containerButton}>
            <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onCloseSuccess}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertSendEmail;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modalContent: {
    width: '80%',
    paddingTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  containerAlertIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alertIcon: {
    fontSize: 48,
    color: '#a5dc86',
  },
  title: {
    fontFamily: 'Aspira W05 Demi',
    fontSize: 20,
    marginBottom: 6,
    color: '#545454',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  message: {
    fontSize: 16,
    color: '#545454',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 16,
    color: '#000000',
    letterSpacing: 0.2,
    textAlign: 'center',
    fontWeight: '500',
  },
  containerButton: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#7066e0',
    paddingVertical: 10,
    borderRadius: 4,
    borderColor: '#b2abff',
    borderWidth: 3,
  },
  buttonText: {
    fontFamily: 'Montserrat Medium',
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
