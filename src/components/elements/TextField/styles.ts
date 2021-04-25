import { isRTL_Lang } from '@src/utils/LangHelper';
import { I18nManager, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 5,
    height: 48,
  },
  leftIcon: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: I18nManager.isRTL ? 10 : 0,
  },
  textField: {
    width: '100%',
    padding: 12,
    borderRadius: 15,
    height: 45,
    textAlign: isRTL_Lang ? 'right' : 'left'
  },
});
