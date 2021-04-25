import * as React from 'react';
import { ScrollView, View } from 'react-native';
import DeliveryInformation from './DeliveryInformation';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import styles from './styles';
import PlaceOrder from './PlaceOrder';
import DishesAlsoOrdered from './DishesAlsoOrdered';
import CartContext from '@src/context/cart-context';
import { useNavigation } from '@react-navigation/core';

type BasketProps = {};


const Basket: React.FC<BasketProps> = () => {
  const { cartItems, clearCart, updateCartItems, resturant } = React.useContext(CartContext);
  const navigation = useNavigation();
  const totalCart = cartItems.reduce(
    (prevValue, currentValue) => prevValue + parseFloat(currentValue.subtotalPrice),
    0,
  );
  const shippingFee = resturant?.ShippingCost || 0;
  const _removeIdx = (idx) => {
    const items = cartItems;
    console.log("itemsb4", items, idx);
    items.splice(idx, 1);
    // delete items[idx];
    console.log("itemsTn", items, idx);
    updateCartItems(items, 0, resturant);
    // removeCartItem(idx);
  };
  React.useEffect(() => {
    if(cartItems.length == 0 && resturant.ID){
      console.log("Clear");
      clearCart();
    }
  }, [cartItems])

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        contentInset={{
          bottom: 25,
        }}>
        <DeliveryInformation />
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
      <PlaceOrder totalPrice={totalCart} shippingFee={shippingFee} />
    </View>
  );
};

export default Basket;
