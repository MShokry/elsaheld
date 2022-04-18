/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import {StatusBar, View, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import ThemeContext from '@src/context/theme-context';
import TabNavigation from '@src/components/routes/TabNavigation';
import DishDetails from '@src/components/screens/DishDetails';
import SearchRest from '@src/components/screens/SearchRest';
import {lightTheme, darkTheme} from '@src/styles/theme';
import AuthContext from '@src/context/auth-context';
import AuthLoading from '../common/AuthProvider/AuthLoading';
import CartContext from '@src/context/cart-context';

import VillaDetails from '@src/components/screens/Villa/VillaDetails';
import AuthenticationStack from './Stacks/AuthenticationStack';
import Reports from '../screens/Reports';

const RootStack = createStackNavigator();

const RootNavigation = () => {
  const {theme} = useContext(ThemeContext);
  // const {userToken} = useContext(AuthContext);
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const {updateCartItems, cartItems, resturant} = React.useContext(CartContext);
  const {userToken} = contextState;
  const flex = 1;
  const rootContainerBackgroundColor = theme === 'light' ? lightTheme.colors.background : darkTheme.colors.background;
  const screenOptions =
    Platform.OS === 'ios'
      ? {
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }
      : {
          ...TransitionPresets.FadeFromBottomAndroid,
        };

  return (
    <NavigationContainer theme={theme === 'light' ? lightTheme : darkTheme}>
      <View style={{flex, backgroundColor: rootContainerBackgroundColor}}>
        <StatusBar
          backgroundColor={theme === 'light' ? lightTheme.colors.background : darkTheme.colors.background}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
        <RootStack.Navigator mode="modal" screenOptions={screenOptions}>
          <RootStack.Screen
            options={{
              headerTransparent: true,
              headerStatusBarHeight: 0,
              title: '',
              headerBackTitleVisible: false,
            }}
            name="AuthLoading"
            component={AuthLoading}
          />
          <RootStack.Screen
            options={{
              headerTransparent: true,
              headerStatusBarHeight: 0,
              title: '',
              headerBackTitleVisible: false,
            }}
            name="Auth"
            component={AuthenticationStack}
          />

          <RootStack.Screen
            name="Main"
            options={{
              headerShown: false,
              headerTitleStyle: {
                fontFamily: 'Cairo-Light',
                fontWeight: '200',
              },
            }}
            component={TabNavigation}
          />
          {/* <RootStack.Screen
            name="VillaDetails"
            options={{
              headerShown: false,
              headerTitleStyle: {
                fontFamily: 'Cairo-Light',
                fontWeight: '200',
              },
            }}
            component={VillaDetails}
          /> */}

          <RootStack.Screen
            title="تفاصيل"
            options={{
              title: 'تفاصيل',
              headerBackTitleVisible: false,
            }}
            name="VillaDetails"
            component={VillaDetails}
          />

          <RootStack.Screen
            title="تفاصيل"
            options={{
              title: 'تقارير',
              headerBackTitleVisible: false,
            }}
            name="ReportsHistor"
            component={Reports}
          />

          <RootStack.Screen
            options={{
              headerTransparent: true,
              title: '',
              headerBackTitleVisible: false,
            }}
            name="DishDetailsModal"
            component={DishDetails}
          />
          <RootStack.Screen
            options={{
              headerShown: false,
              cardOverlayEnabled: true,
              cardStyleInterpolator: ({current: {progress}}) => ({
                cardStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 0.5, 0.9, 1],
                    outputRange: [0, 0.25, 0.7, 1],
                  }),
                },
                overlayStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: 'clamp',
                  }),
                },
              }),
            }}
            name="SearchRestModal"
            component={SearchRest}
          />
        </RootStack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default RootNavigation;
