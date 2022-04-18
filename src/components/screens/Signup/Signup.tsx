import * as React from 'react';
import { SafeAreaView, View, ScrollView, Alert, Image } from 'react-native';
import { Text, TextField, Button, Container } from '@src/components/elements';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import AuthContext from '@src/context/auth-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { registerUser } from '@src/utils/UsersAPI';
import api from '@src/utils/APICONST';
import * as DataBase from '@src/utils/AsyncStorage';
import SwitchSelector from 'react-native-switch-selector';
import { translate as T } from '@src/utils/LangHelper';
// import { log } from 'react-native-reanimated';

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const navigation = useNavigation();
  // const {signIn} = React.useContext(AuthContext);
  const { card, primary, background } = useThemeColors();
  const [password, setPassword] = React.useState('');
  const [confirmPass, setconfirmPass] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [name, setname] = React.useState('');
  const [email, setemail] = React.useState('');
  const [User, setUser] = React.useState({ error: '', results: [], loading: false });
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
    const USER = { name, username: phoneNumber, email, password, confirmPass, do: "SignUp" }
    registerUser(USER, setUser);
  };
  const _onForgotPasswordButtonPressed = () => {
    navigation.navigate('LoginScreen');
  };

  // console.log(User);

  const loggedUser = async () => {
    const { results } = User;
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
        json_password: results.Result?.EncodedPassword,
        fcmToken: fcmToken ? fcmToken : undefined,
      });
      const U = { user: results.Result };
      DataBase.setItem('userToken', JSON.stringify(U));
      console.log('Welcome USER');
      await contextDispatch({ type: 'LogUser', payload: results.Result });
      navigation.navigate('AuthVerificationCodeScreen');
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [
      //       { name: 'Main' },
      //     ],
      //   }));
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
        <View style={styles.appIconContainer}>
          <Image
            source={require('@src/assets/app/app_icon.png')}
            style={styles.appIcon}
            resizeMode='contain'
          />
        </View>

        <View style={{ flex: 1 }}>

          <TextField
            hasMargin
            style={[{ backgroundColor: card }, styles.phoneNumberTextField]}
            value={name}
            onChangeText={(t: string) => setname(t)}
            placeholder={T('registerScreen.username')}
            textContentType="name"
            autoFocus
          />
          <TextField
            hasMargin
            style={[{ backgroundColor: card }, styles.passwordTextField]}
            value={phoneNumber}
            onChangeText={(t: string) => setPhoneNumber(t)}
            placeholder={T('registerScreen.phone')}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoFocus
          />
          <TextField
            hasMargin
            style={[{ backgroundColor: card }, styles.passwordTextField]}
            value={email}
            onChangeText={(t: string) => setemail(t)}
            placeholder={T('registerScreen.email')}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoFocus
          />
          {/* <Text isSecondary style={styles.note}>
            Communications and transaction history will be sent to this email
            address
      </Text> */}
          <TextField
            hasMargin
            style={[{ backgroundColor: card }, styles.passwordTextField]}
            value={password}
            onChangeText={(t: string) => setPassword(t)}
            placeholder={T('registerScreen.password')}
            secureTextEntry={true}
          />
          <TextField
            hasMargin
            containerStyle={{ marginBottom: 20 }}
            style={[{ backgroundColor: card }, styles.passwordTextField]}
            value={confirmPass}
            error={confirmPass != password && confirmPass.length > 1}
            onChangeText={(t: string) => setconfirmPass(t)}
            placeholder={T('registerScreen.password_confirm')}
            secureTextEntry={true}
          />
          {User.error ? (
              <Text isPrimary hasMargin style={{ marginVertical: 10 }}>
              {User.error}
            </Text>
            ) : null}
          <Button isFullWidth
            onPress={_onNextButtonPressed}
            style={styles.forgotPasswordButton}
            isLoading={User.loading}
          >
            <Text isBold isWhite>{T('registerScreen.signup_button')}</Text>
          </Button>

          <Button
            isFullWidth

            isTransparent
            onPress={_onForgotPasswordButtonPressed}
            style={styles.forgotPasswordButton}>
            <Text >{T('registerScreen.sign_in')}</Text>
          </Button>
        </View>
        {/* </Container> */}
      </ScrollView>

    </View>
  );
};

export default Signup;
