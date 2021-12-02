import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from '@src/components/elements';
import Notification from '@src/components/screens/Notification';
// import Nav from '@src/components/screens/Nav';
import {ScreenNavigationProps} from '../types';
import styles from './styles';
import {Alert, AlertButton} from 'react-native';

type NotificationStackProps = {} & ScreenNavigationProps;
const Stack = createStackNavigator();

const NotificationStack: React.FC<NotificationStackProps> = () => {
  const alertButtons: AlertButton[] = [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {text: 'OK'},
  ];

  return (
    <Stack.Navigator initialRouteName="NotificationScreen">
      <Stack.Screen
        options={() => {
          return {
            headerShown: false,
            title: 'Notifications',
            headerRightContainerStyle: styles.headerRightContainer,
          };
        }}
        name="NotificationScreen"
        component={Notification}
        // component={Nav}
      />
    </Stack.Navigator>
  );
};

export default NotificationStack;
