import {StyleSheet, View} from 'react-native';
import React from 'react';
import Dialog from '../Dialog';
import Button from '../Button';
import TextField from '../TextField';

import {translate as T} from '@src/utils/LangHelper';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import Text from '../Text';
import {POST} from '@src/utils/APICONST';

import MainContext from '@src/context/auth-context';
import {useNavigation} from '@react-navigation/native';

export default function EnterPhone({isVisible, hide}) {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const {card, primary, background} = useThemeColors();
  const [contextState, contextDispatch] = React.useContext(MainContext);
  const [Places, setPlaces] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const navigation = useNavigation();
  console.log('isVisible Modal', isVisible);
  //Verify account from api
  const verifyAccount = () => {
    POST('siteAPI.php?do=verifyNumber&ajax_page=true&json=true', {do: 'verifyNumber', phone: phoneNumber}, setPlaces)
      .then(r => {
        console.log(r);
        hide();
        navigation.navigate('OTP');
        // POST('siteAPI.php?do=verifyAccount&ajax_page=true&json=true', {
        //   do: 'verifyAccount',
        // }).then(e => {
        //   contextDispatch({type: 'setIsPhoneActive', payload: e?.Status});
        // });
      })
      .catch(e => {
        console.log(e);
        if (e.data?.Errors?.[0] === 'Please activate account') {
          hide();
          navigation.navigate('OTP');
        }
      });
  };

  return (
    <Dialog isVisible={isVisible} onBackdropPress={hide}>
      <Text isCenter>يرجي ادخال رقم هاتف للتواصل</Text>
      <TextField
        hasMargin
        style={[{backgroundColor: card}, styles.passwordTextField]}
        value={phoneNumber}
        onChangeText={t => setPhoneNumber(t)}
        placeholder={T('registerScreen.phone')}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoFocus
      />
      <Text isCenter>يجب التاكد من رقم الهاتف صحيح</Text>
      <View style={styles.confirmButtonContainer}>
        <Button isLoading={Places.loading} isFullWidth onPress={verifyAccount}>
          <Text isWhite isBold>
            تاكيد
          </Text>
        </Button>
      </View>
      <View style={styles.cancelButtonContainer}>
        <Button isFullWidth isTransparent onPress={hide}>
          <Text>الغاء</Text>
        </Button>
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({});
