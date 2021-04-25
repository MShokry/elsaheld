import * as React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button, Icon, Text} from '@src/components/elements';
import Home from '@src/components/screens/Home';
import PlaceDetails from '@src/components/screens/PlaceDetails';
import PlaceList from '@src/components/screens/PlaceList';
import Checkout from '@src/components/routes/Stacks/CheckoutStack';
import styles from './styles';
import {ScreenNavigationProps} from '../types';
import cartContext from '@src/context/cart-context';

type HomeStackProps = {} & ScreenNavigationProps;
type HomeStackParamList = {
  HomeScreen: undefined;
  PlaceDetailsScreen: undefined;
  CheckoutScreen: undefined;
  PlaceListScreen: {
    title?: string;
  };
};
const Stack = createStackNavigator<HomeStackParamList>();
import MainContext from '@src/context/auth-context';

const HomeStack: React.FC<HomeStackProps> = ({navigation}) => {
  const {updateCartItems,cartItems} = React.useContext(cartContext);
  const [contextState, contextDispatch] = React.useContext(MainContext);

  const _renderExploreHeaderTitle = () => {
    return (
      <View style={styles.headerLeftContainer}>
        <Icon
          name="map-marker-alt"
          size={18}
          style={styles.locationIcon}
          isPrimary
        />
        <Text style={styles.headerTitle}>{contextState.locationName || '...'}</Text>
      </View>
    );
  };
console.log("HomeStack cartItems",cartItems.length, cartItems);

  const _renderExploreHeaderRight = () => {
    return (<View style={styles.headerLeftContainer}>
      <Icon
        name="notifications"
        size={22}
        isPrimary
        useIonicons
        onPress={() => navigation.navigate('Notifications')}
      />
      {!!cartItems?.length ? (
      <Icon
        name="cart"
        size={22}
        isPrimary
        style={styles.headerRightContainer}
        useIonicons
        onPress={() => navigation.navigate('CheckoutScreen')}
      />): null}
      </View>
    );
  };

  const _renderPlaceDetailHeaderRight = () => {
    return (
      <Button
        isTransparent
        onPress={() => navigation.navigate('SearchRestModal')}>
        <Icon name="md-search" size={22} isPrimary useIonicons />
      </Button>
    );
  };

  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        options={() => {
          return {
            headerTitle: _renderExploreHeaderTitle,
            title: 'Explore',
            headerTitleAlign: 'left',
            headerRight: _renderExploreHeaderRight,
            headerRightContainerStyle: styles.headerRightContainer,
          };
        }}
        name="HomeScreen"
        component={Home}
      />
      <Stack.Screen
        options={({route}) => {          
          return {
            headerTitle: route.params?.name || 'Neapolitan Pizza',
            headerRight: _renderPlaceDetailHeaderRight,
            headerRightContainerStyle: styles.headerRightContainer,
          };
        }}
        name="PlaceDetailsScreen"
        component={PlaceDetails}
      />
      <Stack.Screen
        options={({route: {params}}) => {
          return {
            headerTitle: params?.title || 'Places',
          };
        }}
        name="PlaceListScreen"
        component={PlaceList}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CheckoutScreen"
        component={Checkout}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
