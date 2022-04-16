import * as React from 'react';
import {View, Image, Platform} from 'react-native';
import {Container, Text, Button} from '@src/components/elements';
import AuthContext from '@src/context/auth-context';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import appleAuth, {appleAuthAndroid, AppleButton} from '@invertase/react-native-apple-authentication';

GoogleSignin.configure({
  iosClientId: '795331296783-pad5ct0580tkgq59qqfg4ql900q48a3i.apps.googleusercontent.com',
  webClientId: '113395012750-4hv89kbff48qs1bsae9usupad275ns78.apps.googleusercontent.com',
});

type AuthenticationProps = {};

const Authentication: React.FC<AuthenticationProps> = () => {
  const navigation = useNavigation();
  const {primary} = useThemeColors();
  // const {signIn} = React.useContext(AuthContext);
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const {userToken} = contextState;

  const _onConnectWithPhoneNumberButtonPressed = () => {
    navigation.navigate('LoginScreen');
  };
  const _onApple = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

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
        appleUserId: null,
        email: userInfo.user?.email || '',
        gmailUserId: userInfo.user?.id,
      };
      // setSocial({
      //   userFirstName: `${userInfo.user?.givenName || ''} ${userInfo.user?.familyName || ''}`,
      //   userEmail: userInfo.user?.email || '',
      //   gmailUserId: userInfo.user?.id,
      //   userPhone: '',
      // });
      // logUserSocial(USER, setUser);
      // logUserGoogle(userInfo.idToken.toString(), setUser);
      // logUserGoogle({...userInfo, accessToken: userInfo.idToken}, setUser);
      // this.setState({ userInfo });
    } catch (error) {
      console.log(error);
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
    //alert('facebook')
    LoginManager.logOut();
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    LoginManager.logInWithPermissions(['public_profile', 'email', 'user_gender']).then(
      function (result) {
        console.log('facebook--', result);
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log('Login success with permissions: ' + result.grantedPermissions.toString(), result);
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('login===facebook', data, data.accessToken.toString());

            // logUserFB(data.accessToken.toString(), data.userID, setUser);
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ', error);
      },
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          // backgroundColor: primary,
        },
      ]}>
      <View style={styles.appIconContainer}>
        <Image source={require('../../../assets/app/app_icon.png')} style={styles.appIcon} resizeMode="contain" />
      </View>
      <Container style={styles.loginMethodContainer}>
        {/* <Text isBold isHeadingTitle>
          Get food you want.
        </Text>
        <Text isSecondary style={styles.introductionText}>
          
        </Text> */}
        <View style={styles.loginMethod}>
          <Button style={styles.button} isFullWidth onPress={_onConnectWithPhoneNumberButtonPressed}>
            <Text isBold isWhite>
              سجل دخول برقم الهاتف
            </Text>
          </Button>
          {appleAuthAndroid.isSupported ||
            (Platform.OS === 'ios' && (
              <Button style={styles.button} backgroundColor="#000" isFullWidth onPress={_onApple}>
                <Text isBold isWhite>
                  تسجيل دخول ب Apple
                </Text>
              </Button>
            ))}
          <Button style={styles.button} backgroundColor="#4267b2" isFullWidth onPress={_onFacebook}>
            <Text isBold isWhite>
              تسجيل دخول ب Facebook
            </Text>
          </Button>
          <Button style={styles.button} backgroundColor="#4285F3" isFullWidth onPress={_onGoogle}>
            <Text isBold isWhite>
              تسجيل دخول ب Google
            </Text>
          </Button>
        </View>
      </Container>
    </View>
  );
};

export default Authentication;
