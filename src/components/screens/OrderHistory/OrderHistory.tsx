import * as React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import { List, Button, Text, LoadingIndicator } from '@src/components/elements';
import { orderHistoryList } from '@src/data/mock-order-history';
import { ListRowItemProps } from '@src/components/elements/List/ListRowItem';
import { GetOrders } from '@src/utils/CartAPI';
import { useNavigation } from '@react-navigation/core';

type OrderHistoryProps = {};

const OrderHistory: React.FC<OrderHistoryProps> = () => {
  const [Orders, setOrders] = React.useState({ error: '', results: [], loading: true });
  const navigation = useNavigation();
  React.useEffect(() => {
    GetOrders({
      // json_email: "emadelkomy7@gmail.com",
      // json_password: "d320b3c9217fc14d1ac35557481b8dd919",
    }, setOrders);
  }, []);
  if (Orders.loading) {
    return (<LoadingIndicator size="large" hasMargin />)
  }
  console.log(Orders);

  const data: ListRowItemProps[] = Orders.results?.map((item) => {
    console.log(item);
    
    const { ID, date, RestaurantPhoto, RestaurantName, itemsAmount, items, total } = item;
    const orderItems = items?.map(e => { return e.ItemName }).join(" | ") || '';
    return {
      id: ID,
      title: `${orderItems} | ${RestaurantName}`,
      subTitle: `${itemsAmount} items , ${total}`,
      note: date,
      rightContainerStyle: styles.rightItemContainerStyle,
      rightIcon: (
        <Button isTransparent>
          <Text isBold isPrimary>
            اعادة الطلب
          </Text>
        </Button>
      ),
      leftIcon:(
        <Image source={{ uri: `https://www.ebda3-eg.com/arrivo/uploads/${RestaurantPhoto}` }} style={styles.profileAvatar} />
      ),
    };
  }) || [];
  return (
    <View style={styles.root}>
      {data?.length ?
        <List data={data} /> : null
      }
      {!data?.length && !Orders.loading &&
        <View style={{ alignSelf: 'center', margin: 20, marginTop: 50 }}>
          <Text isBold >لا يوجد طلبات </Text>
          <Button
            isFullWidth
            isTransparent
            onPress={() => { navigation.navigate('HomeScreen'); }}
          >
            <Text >اطلب الان</Text>
          </Button>
        </View>
      }
    </View>
  );
};

export default OrderHistory;
