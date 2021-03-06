import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from '@src/components/elements';
import Account from '@src/components/screens/Account';
import EditProfile from '@src/components/screens/EditProfile';
import OrderHistory from '@src/components/screens/OrderHistory';
import SavedAddresses from '@src/components/screens/SavedAddresses';
import AddAddress from '@src/components/screens/AddAddress';
import Settings from '@src/components/screens/Settings';
import SupportCenter from '@src/components/screens/SupportCenter';
import SelectLocationScreen from '@src/components/screens/SelectLocation';
import {ScreenNavigationProps} from '../types';
import styles from './styles';
import OrderHistoryRide from '@src/components/screens/OrderHistoryRide';
import OrderHistoryVilla from '@src/components/screens/OrderHistoryVilla';

type AccountStackProps = {} & ScreenNavigationProps;
const Stack = createStackNavigator();

const AccountStack: React.FC<AccountStackProps> = props => {
  const {navigation} = props;

  const _renderAddAddressHeaderRight = () => {
    return <Icon name="map" size={18} isPrimary onPress={() => navigation.navigate('SelectLocationScreen')} />;
  };

  return (
    <Stack.Navigator initialRouteName="AccountScreen">
      <Stack.Screen
        options={() => {
          return {
            title: 'حسابي',
          };
        }}
        name="AccountScreen"
        component={Account}
      />
      <Stack.Screen
        options={() => {
          return {
            title: 'تعديل الحساب',
          };
        }}
        name="EditProfileScreen"
        component={EditProfile}
      />
      <Stack.Screen
        options={() => {
          return {
            title: 'طلباتي',
          };
        }}
        name="OrderHistoryScreen"
        component={OrderHistory}
      />
      <Stack.Screen
        options={() => {
          return {
            title: ' طلبات التوصيل',
          };
        }}
        name="OrderHistoryRideScreen"
        component={OrderHistoryRide}
      />
      <Stack.Screen
        options={() => {
          return {
            title: ' طلبات الشاليهات',
          };
        }}
        name="OrderHistoryVillaScreen"
        component={OrderHistoryVilla}
      />
      <Stack.Screen
        name="SavedAddressesScreen"
        options={{
          headerTitle: 'العناوين',
        }}
        component={SavedAddresses}
      />
      <Stack.Screen
        name="AddAddressScreen"
        options={{
          headerTitle: 'اضافة عنوان',
          // headerRight: _renderAddAddressHeaderRight,
          headerRightContainerStyle: styles.headerRightContainer,
        }}
        component={AddAddress}
      />
      <Stack.Screen
        name="SettingsScreen"
        options={{
          headerTitle: 'Settings',
        }}
        component={Settings}
      />
      <Stack.Screen
        name="SupportCenterScreen"
        options={{
          headerTitle: 'Support Center',
        }}
        component={SupportCenter}
      />
      <Stack.Screen
        name="SelectLocationScreen"
        options={{
          headerTitle: 'Select location',
        }}
        component={SelectLocationScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
