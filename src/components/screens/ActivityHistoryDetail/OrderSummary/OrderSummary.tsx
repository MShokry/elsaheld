import * as React from 'react';
import {View} from 'react-native';
import {Container, Text, Section, Divider} from '@src/components/elements';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {OrderDetail} from '@src/data/mock-activity-history';
import { translate as T } from '@src/utils/LangHelper';

type OrderSummaryProps = {
  orderDetail: OrderDetail;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderDetail: {name, price, shippingFee, totalItems},
}) => {
  const totalPrice = price * totalItems;

  return (
    <Section title={T('Cart.OrderSummary')}>
      <Container>
        <View style={styles.menuContainer}>
          <View style={styles.menuInfo}>
            <View>
              <Text style={styles.mainDishText} isBold>
                {name}
              </Text>
            </View>
          </View>
          <Text isBold>{formatCurrency(totalPrice)}</Text>
        </View>
        <Divider />
        <View style={styles.priceContainer}>
          <View style={styles.subTotalContainer}>
            <Text>{T('Cart.Subtotal')}</Text>
            <Text>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.deliveryFee}>
            <Text>{T('Cart.delivery')}: 6.1km</Text>
            <Text>{formatCurrency(shippingFee)}</Text>
          </View>
          <View style={styles.deliveryFee}>
            <Text>{T('Cart.total')}</Text>
            <Text>{formatCurrency(totalPrice + shippingFee)}</Text>
          </View>
        </View>
      </Container>
    </Section>
  );
};

export default OrderSummary;
