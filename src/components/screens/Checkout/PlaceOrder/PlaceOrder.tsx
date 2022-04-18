import * as React from 'react';
import {View} from 'react-native';
import {Container, Text, Button} from '@src/components/elements';
import SuccessOrderModal from './SuccessOrderModal';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {createOrder} from '@src/utils/CartAPI';
import cartContext from '@src/context/cart-context';
import {translate as T} from '@src/utils/LangHelper';
import AuthContext from '@src/context/auth-context';
import {useNavigation} from '@react-navigation/core';

type PlaceOrderProps = {
  totalPrice: number;
  shippingFee: number;
  discount: {};
};

const PlaceOrder: React.FC<PlaceOrderProps> = ({discount, totalPrice, shippingFee}) => {
  const {cartItems} = React.useContext(cartContext);
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] = React.useState(false);
  const [Order, setOrder] = React.useState({
    error: '',
    results: [],
    loading: false,
  });
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const navigation = useNavigation();
  const isLogin = contextState.user?.user?.ID;
  // console.log('isLogin', isLogin, contextState);
  console.log('cartItems', cartItems);

  const _onPlaceOrderButtonPressed = () => {
    if (!isLogin) {
      navigation.navigate('Auth');
    } else {
      let o = '';

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
      function groupBy(array, cb) {
        let groups = Object.create(null);
        array.forEach(function (dish) {
          let items = [];
          const rowLen = dish.sideDishes?.length;
          let sd = '';
          items.push(dish.qty);
          items.push(0);
          dish.sideDishes?.map((side, i) => {
            // const r = `"${JSON.stringify(side).replace(/name/g, "Name").replace(/price/g, "Price").replace(/"/g, '\\"')}"`
            const r = `${JSON.stringify(side).replace(/name/g, 'Name').replace(/price/g, 'Price')}`;
            sd = sd + r + (i + 1 == rowLen ? '' : ',');
            items.push(r);
          });
          let key = cb(dish);
          console.log(dish, key, items);
          groups[key] = groups[key] || [];
          groups[key].push(items);
        });
        return groups;
      }
      const g = groupBy(cartItems, function (i) {
        return i.dish.ID;
      });
      console.log(g, Object.keys(g));

      const order = {
        RestaurantID: cartItems?.[0]?.dish?.Resturant?.ID,
        confirm: true,
        // json_email: "emadelkomy7@gmail.com",
        // json_password: "d320b3c9217fc14d1ac35557481b8dd919",
        notes: '',
        CouponID: discount?.ID || undefined,
        orders: JSON.stringify(g),
      };
      console.log(order);
      createOrder(order, setOrder).then(console.log('order'));
      // setIsSuccessOrderModalVisible(true);
    }
  };

  React.useEffect(() => {
    if (Order.results?.OrderID) {
      setIsSuccessOrderModalVisible(true);
    }
  }, [Order]);

  return (
    <Container style={styles.placeOrderContainer}>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>{T('Cart.total')}</Text>
        {discount?.percentage ? (
          <Text isBold style={styles.totalPriceDiscount}>
            {formatCurrency(totalPrice + shippingFee)}
          </Text>
        ) : null}
        <Text isBold style={styles.totalPriceText}>
          {discount?.percentage
            ? formatCurrency(totalPrice * (1 - discount?.percentage / 100) + shippingFee)
            : formatCurrency(totalPrice + shippingFee)}
        </Text>
      </View>
      <Button
        isLoading={Order.loading}
        disabled={cartItems.length == 0}
        isFullWidth
        onPress={_onPlaceOrderButtonPressed}>
        <Text isBold style={styles.placeOrderText}>
          {T('Cart.PlaceOrder')}
        </Text>
      </Button>
      <SuccessOrderModal
        data={Order.results}
        pay
        isVisible={isSuccessOrderModalVisible}
        setIsVisble={setIsSuccessOrderModalVisible}
      />
    </Container>
  );
};

export default PlaceOrder;
