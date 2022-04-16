import {useNavigation} from '@react-navigation/core';
import {Button, Icon, List, LoadingIndicator, Text} from '@src/components/elements';
import {ListRowItemProps} from '@src/components/elements/List/ListRowItem';
import SuccessOrderModal from '@src/components/screens/Checkout/PlaceOrder/SuccessOrderModal';
import {baseImages, POST} from '@src/utils/APICONST';
import {GetOrdersVilla, ReOrders} from '@src/utils/CartAPI';
import * as React from 'react';
import {Alert, Image, RefreshControl, SafeAreaView, View} from 'react-native';
import TrackOrderModal from '../TrackOrder/TrackOrderModal';
import styles from './styles';

type OrderHistoryProps = {};

const OrderHistory: React.FC<OrderHistoryProps> = () => {
  const [Orders, setOrders] = React.useState({error: '', results: [], loading: true});
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);
  const [isTrack, setisTrack] = React.useState(false);
  const [loadingID, setloadingID] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    GetOrdersVilla({}, setOrders);
  }, []);

  const onRefresh = () => {
    GetOrdersVilla({}, setOrders);
  };

  if (Orders.loading && !Orders.results?.Result?.length) {
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
    Orders.results?.map(item => {
      const {ID, flat, CheckIn, CheckOut, RestaurantPhoto, totalCost, price, items, photo, History, Cancelled} =
        item || {};
      const lastHistory = History?.length ? History[History.length - 1]?.Title : 'جاري استلام الطلب';
      return {
        id: ID,
        title: `رقم الحجز #${ID} ` + '  ' + totalCost + 'EGP',
        subTitle: CheckIn + ' : ' + CheckOut,
        note: lastHistory.toString(),
        onPress: () => {
          // setisTrack(item);
          Alert.alert('حذف الحجز', 'هل تريد حذف هذا الطلب ؟', [
            {
              text: 'تاكيد',
              style: 'cancel',
              onPress: () => {
                POST('ebService.php?json=true&do=cancelBooking', {id: ID}).then(e => {
                  onRefresh();
                });
              },
            },
            {text: 'عودة'},
          ]);
        },
        rightContainerStyle: styles.rightItemContainerStyle,
        rightIcon: <Icon color="#fff" name="trash-alt" />,
        leftIcon: (
          <Image
            source={flat?.small_pic ? {uri: `${baseImages}${flat.small_pic}`} : {uri: `${baseImages}${flat?.photo}`}}
            style={styles.profileAvatar}
          />
        ),
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
      />
    </View>
  );
};

export default OrderHistory;
