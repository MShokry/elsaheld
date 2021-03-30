import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  root: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    flex: 1,
  },
  row:{
    width: 73,
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginTop: 20,
  },
  loginMethodContainer: {
    padding: 25,
    paddingBottom: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContainer: {
    paddingTop: '20%',
    marginBottom: 30,
  },
  appIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIcon: {
    width: '50%',
    height: '50%',
  },
  passwordTextField: {
    marginTop: 10,
    marginBottom: 30,
  },
  phoneNumberTextField: {
    marginTop: 30,
  },
  modalContainer: {
    padding: 20,
  },
  passwordText: {
    marginTop: 15,
    marginBottom: 15,
  },
  confirmButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
});
