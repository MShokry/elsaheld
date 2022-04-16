import * as React from 'react';
import {SafeAreaView, View, ScrollView, Alert, Image, Platform, Dimensions} from 'react-native';
import {Text, TextField, Button, Touchable, Icon} from '@src/components/elements';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import AuthContext from '@src/context/auth-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {logUser} from '@src/utils/UsersAPI';
import api, {POST} from '@src/utils/APICONST';
import * as DataBase from '@src/utils/AsyncStorage';
import SwitchSelector from 'react-native-switch-selector';
import {translate as T} from '@src/utils/LangHelper';
// import { log } from 'react-native-reanimated';

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager, LoginButton, AuthenticationToken} from 'react-native-fbsdk-next';
import appleAuth, {appleAuthAndroid, AppleButton} from '@invertase/react-native-apple-authentication';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

GoogleSignin.configure({
  iosClientId: '113395012750-ncjcbc6q4bfrfbk35t1bmbnb7qna4eh0.apps.googleusercontent.com',
  webClientId: '113395012750-4hv89kbff48qs1bsae9usupad275ns78.apps.googleusercontent.com',
});

type LoginProps = {};

const {width, height} = Dimensions.get('screen');
const W = width - 40;

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

  const _onApple = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const USER = {
        userID: appleAuthRequestResponse?.user,
        email: appleAuthRequestResponse?.email ? appleAuthRequestResponse?.email : '',
        do: 'SignInFacebookGmail',
        provider: 'apple',
        name: `${appleAuthRequestResponse.user?.givenName || ''} ${appleAuthRequestResponse.user?.familyName || ''}`,
        photoURL: appleAuthRequestResponse.user?.photo ?? ' ',
      };
      POST('siteAPI.php?json=true', USER, setUser);
    }
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
  };
  const _onGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('google info====', userInfo);
      const USER = {
        do: 'SignInFacebookGmail',
        provider: 'google',
        userID: userInfo.user?.id ?? ' ',
        name: `${userInfo.user?.givenName || ''} ${userInfo.user?.familyName || ''}`,
        email: userInfo.user?.email || '',
        photoURL: userInfo.user?.photo ?? ' ',
      };
      POST('siteAPI.php?json=true', USER, setUser);
    } catch (error) {
      console.log('error', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const _onFacebook = async () => {
    LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      function (result) {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then(data => {
            const {accessToken} = data;
            console.log('Facebook Token ', data);
            fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
              .then(response => response.json())
              .then(json => {
                const USER = {
                  do: 'SignInFacebookGmail',
                  provider: 'facebook',
                  userID: json.id || data?.userID || ' ',
                  name: `${json.name || ''}`,
                  email: json.email || '',
                  photoURL: json.photo ?? ' ',
                };
                POST('siteAPI.php?json=true', USER, setUser);
              })
              .catch(() => {});
          });
        }
      },
      function (error) {
        console.log(error);
      },
    );
  };
  // const _onFacebook = async (error, result) => {
  //   if (error) {
  //     console.log('login has error: ', result.error);
  //   } else if (result.isCancelled) {
  //     console.log('login is cancelled.');
  //   } else {
  //     AccessToken.getCurrentAccessToken().then(data => {
  //       const {accessToken} = data;
  //       console.log('Facebook Token ', data);
  //       fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
  //         .then(response => response.json())
  //         .then(json => {
  //           const USER = {
  //             do: 'SignInFacebookGmail',
  //             provider: 'facebook',
  //             userID: json.id || data?.userID || ' ',
  //             name: `${json.name || ''}`,
  //             email: json.email || '',
  //             photoURL: json.id ?? ' ',
  //           };
  //           POST('siteAPI.php?json=true', USER, setUser);
  //         })
  //         .catch(() => {});

  //       // onAuth('facebook', token);
  //     });
  //   }
  //   // LoginManager.logOut();
  //   if (Platform.OS === 'android') {
  //     LoginManager.setLoginBehavior('web_only');
  //   }
  //   if (Platform.OS === 'android') {
  //     LoginManager.setLoginBehavior('web_only');
  //   }
  //   LoginManager.logInWithPermissions(['email', 'public_profile']).then(
  //     function (result) {
  //       if (!result.isCancelled) {
  //         AccessToken.getCurrentAccessToken().then(token => {
  //           console.log('Facebook Token ', token);
  //           const USER = {
  //             do: 'SignInFacebookGmail',
  //             provider: 'facebook',
  //             userID: token?.userID ?? ' ',
  //             name: `${userInfo.user?.givenName || ''} ${userInfo.user?.familyName || ''}`,
  //             email: userInfo.user?.email || '',
  //             photoURL: userInfo.user?.photo ?? ' ',
  //           };
  //           POST('siteAPI.php?json=true', USER, setUser);
  //           // onAuth('facebook', token);
  //         });
  //       }
  //     },
  //     function (error) {
  //       console.log(error);
  //     },
  //   );
  // };

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
        <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.appIconContainer}>
            <Image source={require('@src/assets/app/app_icon.png')} style={styles.appIcon} resizeMode="contain" />

            {/* <Container style={styles.loginMethodContainer}> */}
            <View>
              <TextField
                containerStyle={[{backgroundColor: card}, styles.phoneNumberTextField]}
                value={phoneNumber}
                onChangeText={(t: string) => setPhoneNumber(t)}
                hasMargin
                placeholder={T('loginScreen.phone')}
                keyboardType="phone-pad"
                autoFocus
              />
              <View style={{height: 10}} />
              <TextField
                // style={[ {width: '90%'}]}
                containerStyle={[{backgroundColor: card, marginTop: 10}, styles.passwordTextField]}
                rightIcon={show ? 'eye' : 'eye-slash'}
                hasMargin
                rightIconSize={18}
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

            <View style={{}}>
              <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                  width: W + 8,
                  height: 50,
                  marginBottom: 10,
                  marginTop: 10,
                }}
                onPress={_onGoogle}
              />

              <Button
                isFullWidth
                onPress={_onGoogle}
                style={{
                  backgroundColor: '#3b5998',
                }}>
                <Text isBold isWhite>
                  {T('loginScreen.login_button')} Google
                </Text>
              </Button>

              {/* <GoogleSigninButton
                style={{width: W, height: 50, marginBottom: 10}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={_onGoogle}
                // disabled={this.state.isSigninInProgress}
              /> */}
              <Button
                isFullWidth
                onPress={_onFacebook}
                style={{
                  backgroundColor: '#4285F4',
                  marginTop: 10,
                }}>
                <Text isBold isWhite>
                  {T('loginScreen.login_button')} Facebook
                </Text>
              </Button>

              {/* <LoginButton
                publishPermissions={['publish_actions']}
                style={{width: W, height: 40, marginBottom: 10}}
                readPermissions={['email', 'public_profile']}
                onLoginFinished={(error, result) => {
                  _onFacebook(error, result);
                }}
                // onLogoutFinished={logout}
                onLogoutFinished={() => console.log('logout.')}
              /> */}
              {/* <Button onPress={_onFacebook}>
                <Text isBold isWhite>
                  Facebook
                </Text>
              </Button> */}
            </View>

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
          <View style={{height: 100}} />
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

export default Login;
