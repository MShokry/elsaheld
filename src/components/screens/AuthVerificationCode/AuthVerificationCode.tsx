import * as React from 'react';
import { SafeAreaView, View, ScrollView, Alert } from 'react-native';
import { Text, Button } from '@src/components/elements';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { verifyUserPhone, verifyUserPhoneResend } from '@src/utils/UsersAPI';
import CountDown from 'react-native-countdown-component';

import AuthContext from '@src/context/auth-context';
import * as DataBase from '@src/utils/AsyncStorage';
import api from '@src/utils/APICONST';

type AuthVerificationCodeProps = {};

const CELL_COUNT = 6;
// [ ] ToDo activate the user in the memory
const AuthVerificationCode: React.FC<AuthVerificationCodeProps> = () => {
  const navigation = useNavigation();
  const { primary, secondary } = useThemeColors();
  const [value, setValue] = React.useState('');
  const [contextState, contextDispatch] = React.useContext(AuthContext);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [User, setUser] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const [isReadyResend, setReadyResend] = React.useState(false);
  const [counterId, setCounterId] = React.useState(`${new Date()}`);

  const _onNextButtonPressed = async () => {
    if (value.length < CELL_COUNT) {
      Alert.alert('خطئ', 'يرجي ادخال ال ٦ ارقام من الرسال التي وصلتك');
      return;
    }
    verifyUserPhone({ activation_code: value, do: 'activation_code', ...contextState?.user?.user, email: contextState?.user?.user?.username }, setUser)
      .then(response => {
        if (response.Result === 'Failed') {
          setUser({ ...User, error: 'فشل تاكيد الرقم' });
        } else {
          DataBase.setItem('userToken', JSON.stringify({ ...contextState?.user, active: 'Yes' }));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            }),
          );
        }
        console.log('response', response.Result);
      })
      .catch(e => console.log(e));
  };
  const resend = async () => {
    verifyUserPhoneResend({ do: 'resendActivationCode', ...contextState?.user?.user, email: contextState?.user?.user?.username }, setUser)
      .then(response => {
        setReadyResend(false);
        setCounterId(`${new Date()}`);
      })
      .catch(e => console.log(e));
  };

  const handleReadyResend = () => {
    setTimeout(() => {
      setReadyResend(true);
    }, 100);
  };
  const _signOutAsync = async () => {
    // await logoutUser(fcmToken, setUser);
    try {
      DataBase.removeItem('language');
      DataBase.removeItem('walkThrough');
      DataBase.removeItem('userToken');
      DataBase.removeItem('userToken');
    } catch (e) {
      console.log('Error Clearing Sorage', e);
    }
    api.setHeaders({});
    // navigation.navigate('Auth');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Auth' },
        ],
      }));
    contextDispatch({ type: 'LogOutUser' });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text isBold isHeadingTitle>
            تاكيد الموبايل
          </Text>
          <Text isSecondary hasMargin>
            تم ارسال رسالة الي هاتفك
          </Text>
          <View style={styles.verificationCodeContainer}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[
                    styles.cellCotainer,
                    {
                      borderColor: isFocused ? primary : secondary,
                    },
                  ]}>
                  <Text
                    key={index}
                    style={styles.cell}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
          </View>
          {User.error ? <Text isPrimary>{User.error}</Text> : null}
        </View>
        {isReadyResend ? (
          <Button
            isTransparent
            onPress={() => {
              resend();
            }}>
            <Text isBold>اعادة ارسال</Text>
          </Button>
        ) : (
          <View style={{}}>
            <Text style={{ alignSelf: 'center' }}>اعادة ارسال بعد</Text>
            <View>
              <CountDown
                id={counterId}
                until={__DEV__ ? 5 : 59}
                onFinish={handleReadyResend}
                timeToShow={['S']}
                timeLabels={{}}
                // digitStyle={style.countDown}
                // digitTxtStyle={{ ...style.text, ...typography[FONT_SIZES.TEXT] }}
                // separatorStyle={{ ...style.text, ...typography[FONT_SIZES.TEXT] }}
                showSeparator
              />
            </View>
          </View>
        )}
        <Button isFullWidth onPress={_onNextButtonPressed}>
          <Text isBold isWhite>
            تاكيد
          </Text>
        </Button>
        <View style={{ marginTop: 10 }} />
        <Button
          isTransparent
          isLoading={User.loading}
          onPress={() => {
            _signOutAsync();
          }}>
          <Text isBold>تسجيل خروج</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthVerificationCode;
