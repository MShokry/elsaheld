import * as React from 'react';
import { Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Text,
  Section,
  Divider,
  Button,
  Icon,
} from '@src/components/elements';
import styles from './styles';
import { CartItem } from '@src/context/cart-context';
import { formatCurrency } from '@src/utils/number-formatter';
import { translate as T } from '@src/utils/LangHelper';
import { Place } from '@src/data/mock-places';
import { baseImages } from '@src/utils/APICONST';

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
  removeIdx,
}) => {
  const navigation = useNavigation();

  const _onAddItemButtonPressed = () => {
    navigation.navigate('DishDetailsModal');
  };

  console.log('cartItems', cartItems, !cartItems.length);
  React.useEffect(() => {
    if (!cartItems.length) {
      navigation.goBack();
    }
  }, [cartItems.length, navigation]);

  return (
    <Section
      title={T('Cart.OrderSummary')}
      // actionButtonText="Add Items"
      onButtonActionPressed={() => { }}>
      <Container>
        {cartItems.map((cartItem, cartItemIndex) => {
          const { photo } = cartItem.dish;
          return (
            <>
              <View key={cartItemIndex} style={styles.menuContainer}>
                <View style={styles.menuInfo}>
                  {!!photo && <Image style={styles.image} source={{ uri: `${baseImages}${photo}` }} />}
                  <Text style={styles.quantityText}>x{`${cartItem.qty}`} </Text>
                  <View key={cartItemIndex}>
                    <Text style={styles.mainDishText} isBold>
                      {cartItem.dish?.name || ' '}
                    </Text>
                    {cartItem.sideDishes?.map((dish, dishIndex) => (
                      <Text
                        isSecondary
                        key={dishIndex}
                        style={styles.sideDishText}>
                        {dish?.Amount}{' '}{dish?.name}
                      </Text>
                    ))}
                  </View>

                </View>
                <Text isBold>{formatCurrency(cartItem.subtotalPrice)}</Text>

              </View>
              <Button childrenContainerStyle={{ width: 100, }} style={styles.button} onPress={() => removeIdx(cartItemIndex)}>
                <View style={styles.buttonItems}>
                  <Icon color='#fff' name="trash-alt" />
                  <Text style={styles.sideDishText} isWhite>  حذف</Text>
                </View>
              </Button>
              <Divider />
            </>
          )
        })}
        <View style={styles.priceContainer}>
          <View style={styles.subTotalContainer}>
            <Text>{T('Cart.Subtotal')}</Text>
            <Text>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.deliveryFee}>
            <Text>
              {T('Cart.delivery')}: {resturant.distance_} km
            </Text>
            <Text>{formatCurrency(shippingFee)}</Text>
          </View>
        </View>
      </Container>
    </Section>
  );
};

export default OrderSummary;
