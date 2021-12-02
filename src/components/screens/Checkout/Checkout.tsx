import { useNavigation } from '@react-navigation/core';
import { Button, Text, TextField } from '@src/components/elements';
import CartContext from '@src/context/cart-context';
import { getCoupon } from '@src/utils/CartAPI';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import DeliveryInformation from './DeliveryInformation';
import OrderSummary from './OrderSummary';
import PlaceOrder from './PlaceOrder';
import styles from './styles';

type BasketProps = {};

// [x] ToDo show empty
const Basket: React.FC<BasketProps> = () => {
  const { cartItems, clearCart, updateCartItems, resturant } =
    React.useContext(CartContext);
  const [Promo, setPromo] = React.useState('');
  const [PromoCode, setPromoCode] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  console.log(PromoCode);

  const navigation = useNavigation();
  const totalCart = cartItems.reduce(
    (prevValue, currentValue) =>
      prevValue + parseFloat(currentValue.subtotalPrice),
    0,
  );
  
  const shippingFee = parseFloat(resturant?.ShippingCost) || 0;
  const _removeIdx = idx => {
    const items = cartItems;
    console.log('itemsb4', items, idx);
    items.splice(idx, 1);
    // delete items[idx];
    console.log('itemsTn', items, idx);
    updateCartItems(items, 0, resturant);
    // removeCartItem(idx);
  };
  React.useEffect(() => {
    if (cartItems.length == 0 && resturant.ID) {
      console.log('Clear');
      clearCart();
    }
  }, [cartItems]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.rootContainer}>
      {/* <View style={styles.rootContainer}> */}
      <ScrollView
        contentInset={{
          bottom: 25,
        }}>
        {/* <DeliveryInformation /> */}
        <OrderSummary
          cartItems={cartItems}
          resturant={resturant}
          totalPrice={totalCart}
          removeIdx={_removeIdx}
          shippingFee={shippingFee}
        />
        {/* <DishesAlsoOrdered /> */}
        {/* <PaymentMethod /> */}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          paddingHorizontal: 5,
        }}>
        <TextField
          value={Promo}
          editable={!PromoCode.results.percentage}
          containerStyle={{ width: '78%', backgroundColor: '#fff' }}
          onChangeText={(t: string) => setPromo(t)}
          placeholder="برومو كود"
        />
        <Button
          disabled={cartItems.length == 0}
          style={{ width: '20%', marginLeft: 10, height: 45, padding: 0, }}
          isLoading={PromoCode.loading}
          onPress={() => {
            if (PromoCode.results?.percentage) {
              setPromoCode({ error: '', results: [], loading: false });
              setPromo('');
            } else {
              getCoupon(Promo, setPromoCode);
            }
          }}>
          {PromoCode.results?.percentage ? (
            <Text isWhite isBold>حذف</Text>
          ) : (
            <Text isWhite isBold>تاكيد</Text>
          )}
        </Button>
      </View>
      {PromoCode.results?.error ? (
        <Text isPrimary>{PromoCode.results?.error}</Text>
      ) : null}

      <PlaceOrder
        discount={PromoCode.results}
        totalPrice={totalCart}
        shippingFee={shippingFee}
      />
      {/* </View > */}
    </KeyboardAvoidingView>
  );
};

export default Basket;
