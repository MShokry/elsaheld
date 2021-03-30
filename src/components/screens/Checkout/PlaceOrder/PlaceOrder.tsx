import * as React from 'react';
import { View } from 'react-native';
import { Container, Text, Button } from '@src/components/elements';
import SuccessOrderModal from './SuccessOrderModal';
import styles from './styles';
import { formatCurrency } from '@src/utils/number-formatter';
import { createOrder } from '@src/utils/CartAPI';
import cartContext from '@src/context/cart-context';

type PlaceOrderProps = {
  totalPrice: number;
  shippingFee: number;
};

const PlaceOrder: React.FC<PlaceOrderProps> = ({ totalPrice, shippingFee }) => {
  const { cartItems } = React.useContext(cartContext);
  const [
    isSuccessOrderModalVisible,
    setIsSuccessOrderModalVisible,
  ] = React.useState(false);
  const [Order, setOrder] = React.useState({ error: '', results: [], loading: true });

  const _onPlaceOrderButtonPressed = () => {
    let o = ''
    console.log(cartItems);

    // { "8": [["3", 0, 
    // "{ \"ID\":\"9\" , \"Name\":\"ÙƒØ¨ÙŠØ±\" , \"Price\":\"220\" }", "{ \"ID\":\"12\" ,
    //  \"Name\":\"Ø³Ù„Ø·Ø©\" , \"Price\":\"10\" }", "{ \"ID\":\"13\" , \"Name\":\"Ø·Ø­ÙŠÙ†Ø©\" , \"Price\":\"8\" }",
    //  "{ \"ID\":\"14\" , \"Name\":\"ÙƒØ§ØªØ´Ø¨\" , \"Price\":\"1\" }"]] }
    // replace Name, Price, "
    // cartItems.map(dish => {
    //   console.log(dish.sideDishes);
    //   let sd = '';
    //   // console.log(test.replace(/\"/g, "")); 
    //   dish.sideDishes?.map(side => sd = sd + `${JSON.stringify(side).replace(/name/g,"Name").replace(/price/g,"Price")},`)
    //   o = `{ ${dish.dish.ID.toString()}: [[${dish.qty}, 0, ${sd}]]}`
    // })
    const cartLen = cartItems?.length;
    cartItems.map((dish, j) => {
      // console.log(dish.sideDishes);
      let sd = '';
      // console.log(test.replace(/\"/g, "")); 
      const rowLen = dish.sideDishes?.length;
      dish.sideDishes?.map((side, i) => {
        const r = `"${JSON.stringify(side).replace(/name/g, "Name").replace(/price/g, "Price").replace(/"/g, '\\"')}"`
        sd = sd + r + (i + 1 == rowLen ? '' : ',');
      })
      // sd = sd;
      o = o + `"${dish.dish.ID.toString()}": [[${dish.qty}, 0, ${sd}]]`+ (j + 1 == cartLen ? '' : ',');
    })
    o = `{${o}}`;
    const order = {
      RestaurantID: 6,
      confirm: true,
      json_email: "emadelkomy7@gmail.com",
      json_password: "d320b3c9217fc14d1ac35557481b8dd919",
      notes: '',
      orders: o
    }
    console.log(order);

    createOrder(order, setOrder).then(console.log(order))
    // setIsSuccessOrderModalVisible(true);
  };

  return (
    <Container style={styles.placeOrderContainer}>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Total</Text>
        <Text isBold style={styles.totalPriceText}>
          {formatCurrency(totalPrice + shippingFee)}
        </Text>
      </View>
      <Button isFullWidth onPress={_onPlaceOrderButtonPressed}>
        <Text isBold style={styles.placeOrderText}>
          Place Order
        </Text>
      </Button>
      <SuccessOrderModal
        isVisible={isSuccessOrderModalVisible}
        setIsVisble={setIsSuccessOrderModalVisible}
      />
    </Container>
  );
};

export default PlaceOrder;
