import * as React from 'react';
import {SafeAreaView, View, ScrollView, Alert, Image} from 'react-native';
import {Text, TextField, Button, Touchable, Icon} from '@src/components/elements';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import AuthContext from '@src/context/auth-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {logUser} from '@src/utils/UsersAPI';
import api from '@src/utils/APICONST';
import * as DataBase from '@src/utils/AsyncStorage';
import SwitchSelector from 'react-native-switch-selector';
import {translate as T} from '@src/utils/LangHelper';
// import { log } from 'react-native-reanimated';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const navigation = useNavigation();
  // const {signIn} = React.useContext(AuthContext);
  const {card, primary, background} = useThemeColors();
  const [show, setShow] = React.useState(true);
  const isDev = __DEV__;
  const [password, setPassword] = React.useState(isDev ? '123456789' : '');
  const [phoneNumber, setPhoneNumber] = React.useState(isDev ? '01050003138' : '');
  const [User, setUser] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const [lang, setlang] = React.useState(contextState.Lang);

  const myRef = React.useRef(null);
  const phoneInput = React.useRef(null);

  const _onPasswordFieldChange = (value: string) => {
    setPassword(value);
  };

  const _onNextButtonPressed = () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password!');
      return;
    }
    logUser({username: phoneNumber, password, do: 'SignIn'}, setUser);
  };
  const _onForgotPasswordButtonPressed = () => {
    navigation.navigate('ForgotPasswordScreen');
  };
  const _onSignUpButtonPressed = () => {
    navigation.navigate('SignupScreen');
  };
  const _skip = () => {
    contextDispatch({type: 'skipLogUser', payload: 'Test'});
    navigation.navigate('Main');
  };

  const loggedUser = async () => {
    const {results} = User;
    console.log('User is Logging');
    const fcmToken = null;
    if (results.Status == 1) {
      console.log(results);
      const token = results.token;
      api.setHeaders({
        authorization: token,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Language': lang,
        json_email: results.Result?.username,
        json_password: results.Result?.password,
        fcmToken: fcmToken ? fcmToken : undefined,
      });
      const U = {user: results.Result};
      DataBase.setItem('userToken', JSON.stringify(U));
      console.log('Welcome USER');
      await contextDispatch({type: 'LogUser', payload: results.Result});
      // navigation.navigate('Main');
      if (results?.Result?.active == 'no') {
        navigation.navigate('AuthVerificationCodeScreen');
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Main'}],
          }),
        );
      }
      // await contextDispatch({type: 'LogUser', payload: results});
    }
    return null;
  };

  React.useEffect(() => {
    if (!!User.results) {
      loggedUser();
    }
  }, [User.results]);

  React.useEffect(() => {
    console.log('language change', lang);
    const saveLang = async () => {
      await DataBase.setItem('language', lang);
      contextDispatch({type: 'SetLang', payload: lang});
    };
    saveLang();
  }, [lang]);

  const options = [
    {label: 'EN', value: 'en'},
    {label: 'AR', value: 'ar'},
  ];
  const pos = options
    .map(e => {
      return e.value;
    })
    .indexOf(contextState.Lang);
  return (
    <>
      <SafeAreaView />
      <View style={styles.root}>
        <View style={styles.row}>
          <SwitchSelector
            options={options}
            value={pos}
            initial={pos}
            height={32}
            borderRadius={15}
            buttonColor={primary}
            backgroundColor={background}
            onPress={value => setlang(value)}
          />
        </View>
        <Button isTransparent style={{position: 'absolute', left: 0, top: 0, width: 100}} onPress={_skip}>
          <Text>{T('sliderScreen.skip_button')}</Text>
        </Button>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.appIconContainer}>
            <Image source={require('@src/assets/app/app_icon.png')} style={styles.appIcon} resizeMode="contain" />

            {/* <Container style={styles.loginMethodContainer}> */}
            <View>
              <TextField
                style={[{backgroundColor: card}, styles.phoneNumberTextField]}
                value={phoneNumber}
                onChangeText={(t: string) => setPhoneNumber(t)}
                hasMargin
                placeholder={T('loginScreen.phone')}
                keyboardType="phone-pad"
                autoFocus
              />
              <View style={{height: 10}} />
              <TextField
                style={[{backgroundColor: card, marginTop: 10}, styles.passwordTextField, {width: '90%'}]}
                leftIcon={show ? 'eye' : 'eye-slash'}
                hasMargin
                leftIconSize={16}
                value={password}
                onChangeText={_onPasswordFieldChange}
                secureTextEntry={show}
                onButtonPressed={() => {
                  setShow(!show);
                }}
                placeholder={T('loginScreen.password')}
              />

              {/* <View style={{ flexDirection: 'row' }}>
              <Touchable onPress={() => { setShow(!show) }}>
                <Icon style={{ marginLeft: 20, marginTop: 10 }} size={30} name={show ? "eye" : "eye-close"} size={16} />
              </Touchable>
              <TextField
                style={[{ backgroundColor: card }, styles.passwordTextField, { width: '80%' }]}
                value={password}
                onChangeText={_onPasswordFieldChange}
                hasMargin
                placeholder={T('loginScreen.password')}
                secureTextEntry={show}
              />
            </View> */}
            </View>
            {User.error ? <Text isPrimary>{User.error}</Text> : null}
            <Button
              isFullWidth
              onPress={_onNextButtonPressed}
              isLoading={User.loading}
              style={styles.forgotPasswordButton}>
              <Text isBold isWhite>
                {T('loginScreen.login_button')}
              </Text>
            </Button>
            <Button
              isFullWidth
              isTransparent
              onPress={_onForgotPasswordButtonPressed}
              style={styles.forgotPasswordButton}>
              <Text>{T('loginScreen.forget_password')}</Text>
            </Button>
            <Button isFullWidth isTransparent onPress={_onSignUpButtonPressed} style={styles.forgotPasswordButton}>
              <Text>{T('loginScreen.no_account')}</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Login;
