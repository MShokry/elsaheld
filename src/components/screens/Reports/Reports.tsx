import * as React from 'react';
import {View, Image, Alert, SafeAreaView, RefreshControl, ActivityIndicator} from 'react-native';
import styles from './styles';
import {List, Button, Text, LoadingIndicator} from '@src/components/elements';
import {orderHistoryList} from '@src/data/mock-order-history';
import {ListRowItemProps} from '@src/components/elements/List/ListRowItem';
import {GetOrders, ReOrders, CancelOrders} from '@src/utils/CartAPI';
import {useNavigation} from '@react-navigation/core';
import api, {baseImages, baseURL} from '@src/utils/APICONST';
import SuccessOrderModal from '@src/components/screens/Checkout/PlaceOrder/SuccessOrderModal';
import TrackOrderModal from '../TrackOrder/TrackOrderModal';
import WebView from 'react-native-webview';
import AuthContext from '@src/context/auth-context';

type OrderHistoryProps = {};

const OrderHistory: React.FC<OrderHistoryProps> = ({navigation, route}) => {
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);
  const [isTrack, setisTrack] = React.useState(false);
  const [isLoading, setisLoading] = React.useState(true);

  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const {type} = route?.params || {};
  const {phone, username, password} = contextState?.user?.user;
  // console.log(contextState?.user?.user, type, api.headers);
  const load = () => {
    if (type === 'order') {
      return 'reports/orderPayment.php?';
    } else if (type === 'profit') {
      return 'reports/profit.php?';
    }
    return 'reports/paymentHistory.php?';
  };
  const url = baseURL + load() + `json_email=${username}&json_password=${password}&json_phone=${phone}`;
  //https://www.elsahel.co/driverAPI/reports/paymentHistory.php?json_email=ahmed&json_password=e1ddd2997d6f3dc1dce755848d2636893e
  // https://www.elsahel.co/driverAPI/reports/profit.php?json_email=ahmed&json_password=e1ddd2997d6f3dc1dce755848d2636893e
  // https://www.elsahel.co/driverAPI/reports/orderPayment.php?json_email=ahmed&json_password=e1ddd2997d6f3dc1dce755848d2636893e

  return (
    <View style={styles.root}>
      <SafeAreaView />
      {isLoading && (
        <View>
          <ActivityIndicator
            animating={true}
            color="#84888d"
            size="large"
            hidesWhenStopped={true}
            style={{alignItems: 'center', justifyContent: 'center', padding: 30, flex: 1}}
          />
        </View>
      )}
      <WebView
        source={{
          uri: url,
          headers: {
            json_email: api.headers.json_email,
            json_password: api.headers.json_password,
            Accept: 'application/json',
            'Accept-Language': 'ar',
            'Content-type': 'application/json',
          },
        }}
        style={styles.webview}
        onLoadEnd={() => setisLoading(false)}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('WebView error: ', nativeEvent);
        }}
        renderError={() => (
          <View>
            <ActivityIndicator
              animating={true}
              color="#84888d"
              size="large"
              hidesWhenStopped={true}
              style={{alignItems: 'center', justifyContent: 'center', padding: 30, flex: 1}}
            />
          </View>
        )}
        onNavigationStateChange={s => {}}
      />

      <SuccessOrderModal
        isVisible={isSuccessOrderModalVisible}
        setIsVisble={bool => {
          setIsSuccessOrderModalVisible(bool);
          if (!bool) {
            onRefresh();
          }
        }}
      />
      <TrackOrderModal
        isVisible={!!isTrack?.ID}
        Order={isTrack}
        setIsVisble={bool => {
          setisTrack(bool);
        }}
        reload={() => onRefresh()}
      />
    </View>
  );
};

export default OrderHistory;
