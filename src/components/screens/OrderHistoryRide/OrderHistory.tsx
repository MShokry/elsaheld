import * as React from 'react';
import {View, Image, Alert, SafeAreaView, RefreshControl} from 'react-native';
import styles from './styles';
import {List, Button, Text, LoadingIndicator} from '@src/components/elements';
import {orderHistoryList} from '@src/data/mock-order-history';
import {ListRowItemProps} from '@src/components/elements/List/ListRowItem';
import {GetOrders, ReOrders, CancelOrders} from '@src/utils/CartAPI';
import {useNavigation} from '@react-navigation/core';
import {baseImages} from '@src/utils/APICONST';
import SuccessOrderModal from '@src/components/screens/Checkout/PlaceOrder/SuccessOrderModal';
import TrackOrderModal from '../TrackOrder/TrackOrderModal';

type OrderHistoryProps = {};

const OrderHistory: React.FC<OrderHistoryProps> = () => {
  const [Orders, setOrders] = React.useState({error: '', results: [], loading: true});
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);
  const [isTrack, setisTrack] = React.useState(false);
  const [loadingID, setloadingID] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    GetOrders(
      {
        DataType: 'oldOrders',
        // json_email: "emadelkomy7@gmail.com",
        // json_password: "d320b3c9217fc14d1ac35557481b8dd919",
      },
      setOrders,
    );
  }, []);

  const onRefresh = () => {
    GetOrders({DataType: 'oldOrders'}, setOrders);
  };

  if (Orders.loading && !Orders.results.length) {
    return <LoadingIndicator size="large" hasMargin />;
  }
  console.log(Orders);
  const _ReOrder = id => {
    ReOrders(id, setOrders);
    setIsSuccessOrderModalVisible(true);
  };

  // React.useEffect(() => {
  //   if (ROrders.results?.OrderID) {
  //     setIsSuccessOrderModalVisible(true)
  //   }
  // }, [ROrders])

  const data: ListRowItemProps[] =
    Orders.results?.Result?.map(item => {
      const {ID, net, RestaurantPhoto, RestaurantName, itemsAmount, items, Status, History, Cancelled} = item;
      const lastHistory = History?.length ? History[History.length - 1]?.Title : 'جاري استلام الطلب';
      const orderItems =
        items
          ?.map(e => {
            return e.ItemName;
          })
          .join(' | ') || '';
      return {
        id: ID,
        title: `#${ID}, ${item.name}`,
        subTitle: ` عدد الاصناف: ${itemsAmount}, ${net} EGP, ${orderItems}`,
        note: lastHistory.toString(),
        onPress: () => {
          setisTrack(item);
        },
        rightContainerStyle: styles.rightItemContainerStyle,
        leftIcon: <Image source={{uri: `${baseImages}${RestaurantPhoto}`}} style={styles.profileAvatar} />,
      };
    }) || [];

  return (
    <View style={styles.root}>
      <SafeAreaView />
      {data?.length ? (
        <List refreshControl={<RefreshControl refreshing={Orders.loading} onRefresh={onRefresh} />} data={data} />
      ) : null}
      {!data?.length && !Orders.loading && (
        <View style={{alignSelf: 'center', margin: 20, marginTop: 50}}>
          <Text isBold>لا يوجد طلبات </Text>
          <Button
            isFullWidth
            isTransparent
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}>
            <Text>اطلب الان</Text>
          </Button>
        </View>
      )}
      <SuccessOrderModal
        isVisible={isSuccessOrderModalVisible}
        isHistory
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
