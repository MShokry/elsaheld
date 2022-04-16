import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  root: {
    height: '100%',
    marginTop: 20,
  },
  contentContainer: {
    padding: 15,
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
    height: 280,
  },
  passwordTextField: {
    marginBottom: 30,
    marginHorizontal: 20,
  },
  phoneNumberTextField: {
    // marginTop: 30,
    marginHorizontal: 20,
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
