import * as React from 'react';
import { View } from 'react-native';
import styles from './styles';
import { List, Button, Text } from '@src/components/elements';
import { orderHistoryList } from '@src/data/mock-order-history';
import { ListRowItemProps } from '@src/components/elements/List/ListRowItem';
import { GetOrders } from '@src/utils/CartAPI';

type OrderHistoryProps = {};

const OrderHistory: React.FC<OrderHistoryProps> = () => {
  const [Orders, setOrders] = React.useState({ error: '', results: [], loading: false });
  React.useEffect(() => {
    GetOrders({
      json_email: "emadelkomy7@gmail.com",
      json_password: "d320b3c9217fc14d1ac35557481b8dd919",
    }, setOrders);
  }, []);
  const data: ListRowItemProps[] = Orders.results?.map((item) => {
    const { ID, date, name, RestaurantName, itemsAmount, items, total } = item;
    const orderItems = items.map(e => { return e.ItemName }).join(" | ");
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
    };
  });
  return (
    <View style={styles.root}>
      <List data={data} />
    </View>
  );
};

export default OrderHistory;
