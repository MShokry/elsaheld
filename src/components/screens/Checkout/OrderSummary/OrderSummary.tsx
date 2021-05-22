import * as React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Section, Divider, Button, Icon } from '@src/components/elements';
import styles from './styles';
import { CartItem } from '@src/context/cart-context';
import { formatCurrency } from '@src/utils/number-formatter';
import { translate as T } from '@src/utils/LangHelper';
import { Place } from '@src/data/mock-places';

type OrderSummaryProps = {
  cartItems: CartItem[];
  totalPrice: number;
  shippingFee: number;
  resturant: Place;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  totalPrice,
  shippingFee,
  resturant,
  removeIdx
}) => {
  const navigation = useNavigation();

  const _onAddItemButtonPressed = () => {
    navigation.navigate('DishDetailsModal');
  };
  
  return (
    <Section
      title={T('Cart.OrderSummary')}
      // actionButtonText="Add Items"
      onButtonActionPressed={() => { }}>
      <Container>
        {cartItems.map((cartItem, cartItemIndex) => (<>
          <View key={cartItemIndex} style={styles.menuContainer}>
            <View style={styles.menuInfo}>
              <Text style={styles.quantityText}>{`${cartItem.qty}`}</Text>
              <View key={cartItemIndex}>
                <Text style={styles.mainDishText}  isBold>
                  {cartItem.dish.name}
                </Text>
                {cartItem.sideDishes.map((dish, dishIndex) => (
                  <Text isSecondary key={dishIndex} style={styles.sideDishText}>
                    {dish.name}
                  </Text>
                ))}
              </View>
            </View>
            <Text isBold>{formatCurrency(cartItem.subtotalPrice)}</Text>
            <Button onPress={()=>removeIdx(cartItemIndex)}>
              <Icon name='trash-alt' />
              {/* <Text style={styles.sideDishText} isBold>x</Text> */}
            </Button>
          </View>
          <Divider />
        </>))}
        <View style={styles.priceContainer}>
          <View style={styles.subTotalContainer}>
            <Text>{T('Cart.Subtotal')}</Text>
            <Text>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.deliveryFee}>
            <Text>{T('Cart.delivery')}: {resturant.distance_} km</Text>
            <Text>{formatCurrency(shippingFee)}</Text>
          </View>
        </View>
      </Container>
    </Section>
  );
};

export default OrderSummary;
