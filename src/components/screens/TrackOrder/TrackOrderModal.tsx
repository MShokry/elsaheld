import {useNavigation} from '@react-navigation/native';
import {Button, Container, Dialog, Divider, Text} from '@src/components/elements';
import CartContext from '@src/context/cart-context';
import {baseImages, POST} from '@src/utils/APICONST';
import {CancelOrders, ReOrders} from '@src/utils/CartAPI';
import * as React from 'react';
import {Alert, Animated, Image, ScrollView, View} from 'react-native';
import styles from './styles';

type TrackOrderModalProps = {
  isVisible: boolean;
  setIsVisble: (value: React.SetStateAction<boolean>) => void;
  reload: () => void;
  Order: Object;
};

const TrackOrderModal: React.FC<TrackOrderModalProps> = ({isVisible, Order, setIsVisble, reload = () => {}}) => {
  const navigation = useNavigation();
  const [isMapViewVisible, setIsMapViewVisible] = React.useState(false);
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const fadeOut = React.useRef(new Animated.Value(1)).current;
  const [isAnimationFinished, setIsAnimationFinished] = React.useState(false);
  const [ROrders, setROrders] = React.useState({error: '', results: {}, loading: false});

  React.useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: isAnimationFinished ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeOut, {
      toValue: isAnimationFinished ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isAnimationFinished, fadeIn, fadeOut]);
  const {clearCart} = React.useContext(CartContext);

  const _onAnimationFinish = () => {
    setIsAnimationFinished(true);
  };

  const _onBackdropPress = () => {
    setIsVisble(false);
    setIsAnimationFinished(false);
  };

  const _onOrderSomethingElseButtonPressed = () => {
    navigation.navigate('HomeScreen');
  };

  const _onMapViewButtonPressed = () => {
    setIsMapViewVisible(!isMapViewVisible);
  };
  console.log(Order);
  const _CancelOrder = id => {
    Alert.alert('الغاء الطلب', 'هل تريد الغاء الطلب ؟', [
      {
        text: 'تاكيد',
        style: 'cancel',
        onPress: () => {
          CancelOrders({id, do: 'cancelOrder'}, setROrders).then(e => {
            setIsVisble(false);
            reload();
          });
        },
      },
      {text: 'عودة'},
    ]);
  };

  const ChangeOrderState = St => {
    POST('?json=true', {do: 'changeOrderStatus', status: St, ID}, setROrders).then(e => {
      setIsVisble(false);
      reload();
    });
  };

  const {ID, status, RestaurantName, itemsAmount, items, total, History, Cancelled} = Order;
  return (
    <Dialog isVisible={isVisible} onBackdropPress={_onBackdropPress}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainerStyle}>
        {/* <Container>
          <DeliveryTime />
          <Divider />
          <DriverInformation />
        </Container> */}
        {/* {isMapViewVisible ? <DeliveryMapView /> : <DeliveryStep />} */}

        <>
          <View style={styles.menuContainer}>
            {/* <Image
              source={{uri: `${baseImages}${cartItem.MainItemPhoto}`}}
              style={{
                width: 60,
                height: 60,
              }}
            /> */}
            <View style={styles.menuInfo}>
              <Text style={styles.quantityText}>{`${Order.cost}`}جم</Text>
              <View>
                <Text isSecondary style={styles.sideDishText}>
                  {Order.add_date}
                </Text>
                <Text style={styles.mainDishText} isBold>
                  اسم العميل {Order.name}
                </Text>
                <Text style={styles.mainDishText} isBold>
                  رقم التليفون {Order.phone}
                </Text>
                <Text style={styles.mainDishText} isBold>
                  العنوان {Order.address}
                </Text>
                <Text isSecondary style={styles.sideDishText}>
                  الاجمالي {Order.net} - الخصم {Order.Discount}
                </Text>
                <Text isSecondary style={styles.sideDishText}>
                  التوصيل {Order.shippingCost}
                </Text>
                <Divider />
                <Text isSecondary style={styles.sideDishText}>
                  المستحق {Order.cost}
                </Text>
                <Divider />
                <Text isSecondary style={styles.sideDishText}>
                  نوع الطلب {Order.TYPE}
                </Text>
              </View>
            </View>
            <Text isBold>#{Order.ID}</Text>
          </View>
        </>
      </ScrollView>
      <Container style={styles.footerButtonContainer}>
        {/* <Button isFullWidth onPress={_onMapViewButtonPressed}>
          <Text isWhite isBold style={styles.mapViewText}>
            {isMapViewVisible ? 'محتويات الطلب' : 'حالة الطلب'}
          </Text>
        </Button> */}
        {/* <Button
          isFullWidth
          isTransparent
          onPress={() => _CancelOrder(Order.ID)}
          style={styles.cancelOrderButton}>
          <Text>Cancel your order</Text>
        </Button> */}

        {status <= 2 ? (
          <View>
            <Button isLoading={ROrders.loading} isFullWidth onPress={() => ChangeOrderState('2')}>
              <Text isWhite isBold style={styles.mapViewText}>
                تاكيد الطلب
              </Text>
            </Button>
            <Button isTransparent onPress={() => ChangeOrderState('3')}>
              <Text isBold isPrimary>
                رفض الطلب
              </Text>
            </Button>
          </View>
        ) : (
          <Button isLoading={ROrders.loading} isTransparent onPress={() => ChangeOrderState('6')}>
            <Text isBold isSecondary>
              توصيل الطلب
            </Text>
          </Button>
        )}
      </Container>
    </Dialog>
  );
};

export default TrackOrderModal;
