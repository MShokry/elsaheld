import React, { useEffect, useContext } from 'react';
import {
  ActivityIndicator,
  View,
  Image,
  Dimensions,
} from 'react-native';

import api from '@src/utils/APICONST.js';
import MainContext from '@src/context/auth-context.ts';
import * as DataBase from '@src/utils/AsyncStorage';
import LottieView from 'lottie-react-native';
import { CommonActions } from '@react-navigation/native';
// import * as Lang from '../utils/LangHelper';
// import { firebase } from '@react-native-firebase/messaging';


const { width, height } = Dimensions.get('window');

const AuthLoading = ({ navigation }) => {
  const [contextState, contextDispatch] = useContext(MainContext);
  let fcmToken;
  // Fetch the token from storage then navigate to our appropriate place
  // const checkPermission = async () => {
  //   const enabled = await firebase.messaging().hasPermission();
  //   console.log('Check FireBAse', enabled);
  //   if (enabled) {
  //     fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //       console.log('fcmToken Store Enable', fcmToken);
  //       // await AsyncStorage.setItem('fcmToken', fcmToken);
  //     }
  //   } else {
  //     try {
  //       console.log('reqPErm');
  //       await firebase.messaging().requestPermission();
  //       //Store Token
  //       fcmToken = await firebase.messaging().getToken();
  //       if (fcmToken) {
  //         console.log('fcmToken Store', fcmToken);
  //       }
  //     } catch (error) {
  //       console.log('permission rejected', error);
  //     }
  //   }
  //   contextDispatch({ type: 'fcmToken', payload: fcmToken });
  //   _bootstrapAsync();
  // };
  const _navAuth = (name) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name },
        ],
      }));
  }
  const _bootstrapAsync = async () => {
    let T = '';
    console.log('Loading Storage');
    const langSymbol = (await DataBase.getItem('language')) || 'ar';
    contextDispatch({ type: 'SetLang', payload: langSymbol });
    console.log('langSymbol', langSymbol);
    const walkThrough = await DataBase.getItem('walkThrough');
    if (walkThrough === 'Done') {
      contextDispatch({ type: 'walkThrough', payload: 0 });
    } else {
      contextDispatch({ type: 'walkThrough', payload: 1 });
    }
    const U = await DataBase.getItem('userToken');
    console.log('U', U);
    if (U !== undefined && U !== null) {
      console.log('Finding Token');
      try {
        const { user } = JSON.parse(U);
        T = user;
        if (T) {
          console.log('token', T);
          contextDispatch({ type: 'LogUser', payload: user });
          api.setHeaders({
            authorization: T ? T : undefined,
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'Accept-Language': langSymbol,
            json_email: user?.phone,
            json_password: user?.password,
            fcmToken: fcmToken ? fcmToken : undefined,
          });
          console.log('Auth NAvigate');
          contextDispatch({ type: 'StopLoading' });
          // navigation.navigate('Main')
          _navAuth('Main');
        } else {
          // navigation.navigate('Auth')
          _navAuth('Auth');
        }
      } catch (e) {
        console.log('user', e);
        // navigation.navigate('Auth')
        _navAuth('Auth');

      }
    } else {
      // navigation.navigate('Auth')
      _navAuth('Auth');
    }

  };

  useEffect(() => {
    try {
      __DEV__ ?
        setTimeout(_bootstrapAsync, 500) : null;
      // setTimeout(_bootstrapAsync, 500);
    } catch (error) {
      contextDispatch({ type: 'StopLoading' });
      console.log('Error', error);
    }
  }, []);
  return (
    <>
      <View
        style={{ flex: 1, alignItems: 'center', alignContent: 'center' }}
        colors={['#eadccf', '#526b7d']}
      >
        {/* <Image
          style={{ width: width * .5 }}
          resizeMode="contain"
          source={require('@src/assets/app/app_icon.png')}
        /> */}
        <LottieView
          source={require('@src/assets/animations/elsahel1.json')}
          autoPlay
          loop={false}
          onAnimationFinish={_bootstrapAsync}
          // onAnimationFinish={()=>{}}
          style={{ width: '100%', height: '100%' }}
        />
        <ActivityIndicator />
      </View>
    </>
  );
};

export default AuthLoading;
