import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  root: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  formContainer: {
    paddingTop: '20%',
    marginBottom: 30,
  },
  codeFieldRoot: { marginTop: 20, direction: 'ltr', },
  cellCotainer: {
    width: 50,
    height: 60,
    marginRight: 7,
    backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cell: {
    width: 48,
    height: 58,
    lineHeight: 60,
    fontSize: 30,
    borderWidth: 2,
    borderRadius: 15,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  verificationCodeContainer: {
    marginTop: 10,
    // direction: 'ltr',
  },
});
