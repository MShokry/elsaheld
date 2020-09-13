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
import AuthenticationStack from '@src/components/routes/Stacks/AuthenticationStack';
import {lightTheme, darkTheme} from '@src/styles/theme';
import AuthContext from '@src/context/auth-context';

const RootStack = createStackNavigator();

const RootNavigation = () => {
  const {theme} = useContext(ThemeContext);
  const {userToken} = useContext(AuthContext);
  const flex = 1;
  const rootContainerBackgroundColor =
    theme === 'light'
      ? lightTheme.colors.background
      : darkTheme.colors.background;
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
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
        <RootStack.Navigator mode="modal" screenOptions={screenOptions}>
          {userToken ? (
            <RootStack.Screen
              name="Main"
              options={{headerShown: false}}
              component={TabNavigation}
            />
          ) : (
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
          )}
          <RootStack.Screen
            options={{
              headerTransparent: true,
              title: '',
              headerBackTitleVisible: false,
            }}
            name="DishDetailsModal"
            component={DishDetails}
          />
        </RootStack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default RootNavigation;
