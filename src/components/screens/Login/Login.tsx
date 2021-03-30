import * as React from 'react';
import { SafeAreaView, View, ScrollView, Alert, Image } from 'react-native';
import { Text, TextField, Button, Container } from '@src/components/elements';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import AuthContext from '@src/context/auth-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { logUser } from '@src/utils/UsersAPI';
import api from '@src/utils/APICONST';
import * as DataBase from '@src/utils/AsyncStorage';
import SwitchSelector from 'react-native-switch-selector';
import { translate as T } from '@src/utils/LangHelper';
// import { log } from 'react-native-reanimated';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const navigation = useNavigation();
  // const {signIn} = React.useContext(AuthContext);
  const { card, primary, background } = useThemeColors();
  const [password, setPassword] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [User, setUser] = React.useState({ error: '', results: [], loading: false });
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const [lang, setlang] = React.useState(contextState.Lang);
  console.log(contextState);
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
    logUser({ username: phoneNumber, password, do: "SignIn" }, setUser);
  };
  const _onForgotPasswordButtonPressed = () => {
    navigation.navigate('ForgotPasswordScreen');
  };
  const _skip = () => {
    contextDispatch({ type: 'skipLogUser', payload: 'Test' });
  };

console.log(User);

  const loggedUser = async () => {
    const { results } = User;
    console.log('User is Logging');
    const fcmToken = null;
    if (results.Status==1) {
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
      const U = { user: results.Result };
      DataBase.setItem('userToken', JSON.stringify(U));
      console.log('Welcome USER');
      await contextDispatch({ type: 'LogUser', payload: results.Result });
      // navigation.navigate('Main');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name:'Main' },
          ],
        }));
      // await contextDispatch({type: 'LogUser', payload: results});
    }
    return null;
  };

  React.useEffect(() => {
    if (User.results) {
      loggedUser();
    }
  }, [User.results]);

  React.useEffect(() => {
    console.log('language change', lang);
    const saveLang = async () => {
      await DataBase.setItem('language', lang);
      contextDispatch({ type: 'SetLang', payload: lang });
    }
    saveLang();
  }, [lang]);

  const options = [
    { label: 'EN', value: 'en' },
    { label: 'AR', value: 'ar' },
  ];
  const pos = options
    .map((e) => {
      return e.value;
    })
    .indexOf(contextState.Lang);
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View
          style={styles.row}>
          <SwitchSelector
            options={options}
            value={pos}
            initial={pos}
            height={32}
            borderRadius={15}
            buttonColor={primary}
            backgroundColor={background}
            onPress={(value) => setlang(value)}
          />
        </View>
        <View style={styles.appIconContainer}>

          <Image
            source={require('@src/assets/app/app_icon.png')}
            style={styles.appIcon}
            resizeMode='contain'
          />
          {/* </View> */}
          {/* <Container style={styles.loginMethodContainer}> */}
          {/* <View style={styles.formContainer}> */}
          <TextField
            style={[{ backgroundColor: card }, styles.phoneNumberTextField]}
            value={phoneNumber}
            onChangeText={(t: string) => setPhoneNumber(t)}
            hasMargin
            placeholder={T('loginScreen.phone')}
            keyboardType="phone-pad"
            autoFocus
          />
          <TextField
            autoFocus
            style={[{ backgroundColor: card }, styles.passwordTextField]}
            value={password}
            onChangeText={_onPasswordFieldChange}
            hasMargin
            placeholder={T('loginScreen.password')}
            secureTextEntry={true}
          />
        </View>
        {User.error ? <Text isPrimary>{User.error}</Text> : null}
        <Button isFullWidth
          onPress={_onNextButtonPressed}
          isLoading={User.loading}
        >
          <Text isBold isWhite>{T('loginScreen.login_button')}</Text>
        </Button>
        <Button
          isFullWidth
          isTransparent
          onPress={_skip}
          style={styles.forgotPasswordButton}>
          <Text >{T('sliderScreen.skip_button')}</Text>
        </Button>
        <Button
          isFullWidth
          isTransparent
          onPress={_onForgotPasswordButtonPressed}
          style={styles.forgotPasswordButton}>
          <Text >{T('loginScreen.forget_password')}</Text>
        </Button>
        {/* </Container> */}
      </ScrollView>
    </View>
  );
};

export default Login;
