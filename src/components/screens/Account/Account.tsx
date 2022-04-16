import * as React from 'react';
import {Container, Icon, Divider, SearchBar, Button, Text} from '@src/components/elements';
import {ScrollView, Image, View, Alert, AlertButton, I18nManager} from 'react-native';
import ListRowItem from '@src/components/elements/List/ListRowItem';
import {profile} from '@src/data/mock-profile';
import styles from './styles';
import {CommonActions, useNavigation} from '@react-navigation/native';
import AuthContext from '@src/context/auth-context';
import * as DataBase from '@src/utils/AsyncStorage';
import api from '@src/utils/APICONST';
import {translate as T} from '@src/utils/LangHelper';

type AccountProps = {};

const Account: React.FC<AccountProps> = () => {
  const navigation = useNavigation();
  // const {signOut} = React.useContext(AuthContext);
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const {userToken} = contextState;
  const chevronIconName = I18nManager.isRTL ? 'chevron-left' : 'chevron-right';
  const user = contextState.user?.user || {};


  const _signOutAsync = async () => {
    // await logoutUser(fcmToken, setUser);
    try {
      DataBase.removeItem('language');
      DataBase.removeItem('walkThrough');
      DataBase.removeItem('userToken');
      DataBase.removeItem('userToken');
    } catch (e) {
      console.log('Error Clearing Sorage', e);
    }
    api.setHeaders({});
    // navigation.navigate('Auth');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      }),
    );
    contextDispatch({type: 'LogOutUser'});
  };

  const alertButtons: AlertButton[] = [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {text: 'OK', onPress: () => _signOutAsync()},
  ];

  const onLogoutButtonPressed = () => {
    Alert.alert('Confirm', 'Are you sure you want to logout?', alertButtons);
  };

  return (
    <ScrollView>
      {/* <SearchBar /> */}
      {/* <Divider /> */}
      <Container>
        <ListRowItem
          title={`مرحبا ${user?.name ? user?.name : ''}`}
          subTitle={user?.phone ? user?.phone : '٠١'}
          onPress={() => navigation.navigate('EditProfileScreen')}
          // leftIcon={
          //   <Image source={profile.avatar} style={styles.profileAvatar} />
          // }
          rightIcon={<Icon name={chevronIconName} />}
        />
      </Container>
      <Container style={styles.accountMenuItemContainer}>
        <Divider />
        <Divider />
        <ListRowItem
          title="طلباتي"
          onPress={() => navigation.navigate('OrderHistoryScreen')}
          rightIcon={<Icon name={chevronIconName} />}
        />
        <Divider />
        <ListRowItem
          title=" طلبات التوصيل"
          onPress={() => navigation.navigate('OrderHistoryRideScreen')}
          rightIcon={<Icon name={chevronIconName} />}
        />
        <Divider />
        <ListRowItem
          title="طلبات الشاليهات"
          onPress={() => navigation.navigate('OrderHistoryVillaScreen')}
          rightIcon={<Icon name={chevronIconName} />}
        />
        <Divider />
        <ListRowItem
          title="العناوين"
          onPress={() => navigation.navigate('SavedAddressesScreen')}
          rightIcon={<Icon name={chevronIconName} />}
        />
        {/* <Divider />
        <ListRowItem
          title="الطلبات"
          onPress={() => navigation.navigate('OrderHistoryScreen')}
          rightIcon={<Icon name={chevronIconName} />}
        /> */}
        <Divider />
        {/* <ListRowItem
          title="الاعدادات"
          // onPress={() => navigation.navigate('SettingsScreen')}
          rightIcon={<Icon name={chevronIconName} />}
        />
        <Divider /> */}

        <ListRowItem
          title="تواصل معنا"
          // onPress={() => navigation.navigate('SupportCenterScreen')}
          rightIcon={<Icon name={chevronIconName} />}
        />
        <Divider />
        {/* <ListRowItem
          title="تواصل معنا"
          rightIcon={<Icon name={chevronIconName} />}
        /> */}
      </Container>
      <View style={styles.buttonContainer}>
        <Button isFullWidth isTransparent onPress={onLogoutButtonPressed}>
          <Text isBold isPrimary>
            {T('SideBar.logout')}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Account;
