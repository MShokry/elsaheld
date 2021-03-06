import * as React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import Authentication from '@src/components/screens/Authentication';
import AuthWithPhoneNumber from '@src/components/screens/AuthWithPhoneNumber';
import AuthVerificationCode from '@src/components/screens/AuthVerificationCode';
import Login from '@src/components/screens/Login';
import ForgotPassword from '@src/components/screens/ForgotPassword';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import Signup from '@src/components/screens/Signup';

type AuthenticationStackProps = {};
const Stack = createStackNavigator();
const options = {
  headerTransparent: true,
  headerStatusBarHeight: 0,
  title: '',
  headerBackTitleVisible: false,
  headerShown: false,
};
const AuthenticationStack: React.FC<AuthenticationStackProps> = () => {
  const insets = useSafeAreaInsets();
  const {background} = useThemeColors();
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: true,
        title: '',
        headerStatusBarHeight: insets.top,
        headerStyle: {backgroundColor: background},
      }}>
      <Stack.Screen
        name="AuthenticationScreen"
        component={Authentication}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="AuthWithPhoneNumberScreen" component={AuthWithPhoneNumber} />
      <Stack.Screen name="AuthVerificationCodeScreen" component={AuthVerificationCode} />
      <Stack.Screen options={options} name="LoginScreen" component={Login} />
      <Stack.Screen options={options} name="SignupScreen" component={Signup} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthenticationStack;
