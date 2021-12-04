import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeStack from '../Stacks/HomeStack';
import AccountStack from '../Stacks/AccountStack';
import NotificationStack from '../Stacks/NotificationStack';
import ActivityHistoryStack from '../Stacks/ActivityHistoryStack';
import Documentation from '@src/components/screens/Documentation';
import OrderHistory from '@src/components/screens/OrderHistory';
import OrderAny from '@src/components/screens/OrderAny';
import Villa from '@src/components/screens/Villa';
import AuthContext from '@src/context/auth-context';

type TabNavigationProps = {};
type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};
const Tab = createBottomTabNavigator();
const {Navigator} = Tab;

const renderTabBarIcon = (routeName: string) => {
  return (props: TabBarIconProps) => {
    const {color} = props;
    let iconName = 'home';
    switch (routeName) {
      case 'Explore':
        iconName = 'compass';
        break;
      case 'Activity':
        iconName = 'history';
        break;
      case 'Notifications':
        iconName = 'bell';
        break;
      case 'Car':
        iconName = 'taxi';
        break;
      case 'MyOrders':
        iconName = 'shopping-cart';
        break;
      case 'Account':
        iconName = 'user';
        break;
      case 'Documentation':
        iconName = 'book';
        break;
      default:
        break;
    }
    return <Icon name={iconName} solid size={20} color={color} />;
  };
};

const TabNavigation: React.FC<TabNavigationProps> = () => {
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const isLogin = contextState.user?.user?.ID;

  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={props => {
        const {
          route: {name: routeName},
        } = props;
        return {
          tabBarIcon: renderTabBarIcon(routeName),
        };
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'القائمة',
        }}
        name="Explore"
        component={HomeStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'شالية',
        }}
        name="House"
        component={Villa}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'مشوار',
        }}
        name="Car"
        component={NotificationStack}
      />
      {/* <Tab.Screen name="Activity" component={ActivityHistoryStack} /> */}
      <Tab.Screen
        options={{
          tabBarLabel: 'اطلب',
        }}
        name="MyOrders"
        component={OrderAny}
      />
      {/* <Tab.Screen name="Notifications" component={NotificationStack} /> */}
      <Tab.Screen
        options={{
          tabBarLabel: 'الحساب',
        }}
        name="Account"
        listeners={({navigation, route}) => ({
          tabPress: e => {
            if (!isLogin) {
              navigation.navigate('Auth');
            }
          },
        })}
        component={AccountStack}
      />
      {/* <Tab.Screen name="Documentation" component={Documentation} /> */}
    </Navigator>
  );
};

export default TabNavigation;
