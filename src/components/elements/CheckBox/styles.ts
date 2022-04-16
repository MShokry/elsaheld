import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  checkBox: {
    width: 18,
    height: 18,
    marginRight: 20,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    flexGrow: 1,
  },
  rightElementContainer: {
    alignItems: 'flex-end',
    flex: 0.3,
  },
  buttonGroupSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonGroupContainer: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 0.5,
  },
  buttonPlus: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0.34,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
