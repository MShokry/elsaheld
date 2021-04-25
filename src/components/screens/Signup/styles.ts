import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',

  },
  container: {
    padding: 10,
    marginTop: 10,
  },
  contentContainer: {
    padding: 15,
    flex: 1,
    // height: '100%',
  },
  note: {
    marginTop: 5,
    marginBottom: 10,
  },
  row: {
    width: 100,
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginRight: 20,
    // marginTop: 20,
  },
  loginMethodContainer: {
    padding: 25,
    paddingBottom: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  formContainer: {
    paddingTop: '20%',
    marginBottom: 30,
  },
  appIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '20%',
  },
  appIcon: {
    width: '35%',
    height: '35%',
  },
  passwordTextField: {
    marginTop: 10,
    // marginBottom: 30,
  },
  phoneNumberTextField: {
    // marginTop: 30,
    // marginBottom: 20,
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
    marginTop: 5,
  },
});
