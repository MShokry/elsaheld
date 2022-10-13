import {useNavigation} from '@react-navigation/native';
import {Button, Container, Dialog, Divider, Text} from '@src/components/elements';
import CartContext from '@src/context/cart-context';
import {baseImages, POST} from '@src/utils/APICONST';
import {CancelOrders, ReOrders} from '@src/utils/CartAPI';
import * as React from 'react';
import {Alert, Animated, Image, Linking, Platform, ScrollView, View} from 'react-native';
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

  const _OnCallrest = phone => {
    const socialURL = `tel:${phone}`;
    try {
      Linking.canOpenURL(socialURL).then(supported => {
        if (supported) {
          Linking.openURL(socialURL);
        } else {
        }
      });
    } catch (error) {}
  };

  const _onMapViewButtonPressed = label => {
    let scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const urls = scheme + label;
    console.log('Goto', urls);

    try {
      Linking.canOpenURL(urls).then(supported => {
        if (supported) {
          Linking.openURL(urls);
        } else {
        }
      });
    } catch (error) {}
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
    <Dialog style={{maxHeight: '60%', marginTop: 80}} isVisible={isVisible} onBackdropPress={_onBackdropPress}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainerStyle}>
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
        {Order?.driver_status > 1 ? (
          <>
            <View style={{alignItems: 'center', marginBottom: 30}}>
              <Text isSecondary style={styles.sideDishText}>
                {Order?.storeInfo?.name}
                {' | '}
                {Order?.storeInfo?.address}
                {'\n'}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Button
                  style={{marginHorizontal: 5}}
                  onPress={() => _onMapViewButtonPressed(Order?.storeInfo?.location)}>
                  <Text isWhite isBold style={styles.mapViewText}>
                    🚗 المطعم
                  </Text>
                </Button>
                <Button style={{marginHorizontal: 10}} onPress={() => _OnCallrest(Order?.storeInfo?.phone_num1)}>
                  <Text isWhite isBold style={styles.mapViewText}>
                    ☎️ المطعم
                  </Text>
                </Button>
              </View>
            </View>
            <View style={{alignItems: 'center', marginBottom: 30}}>
              <Text isSecondary style={styles.sideDishText}>
                {Order?.name}
                {' | '}
                {Order?.address}
                {'\n'}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Button style={{marginHorizontal: 10}} onPress={() => _onMapViewButtonPressed(Order?.Location)}>
                  <Text isWhite isBold style={styles.mapViewText}>
                    🚗 العميل
                  </Text>
                </Button>
                <Button style={{marginHorizontal: 10}} onPress={() => _OnCallrest(Order?.phone)}>
                  <Text isWhite isBold style={styles.mapViewText}>
                    ☎️ العميل
                  </Text>
                </Button>
              </View>
            </View>
          </>
        ) : null}
        {/* <Button
          isFullWidth
          isTransparent
          onPress={() => _CancelOrder(Order.ID)}
          style={styles.cancelOrderButton}>
          <Text>Cancel your order</Text>
        </Button> */}

        {Order?.driver_status < 2 ? (
          <View>
            <Button isLoading={ROrders.loading} isFullWidth onPress={() => ChangeOrderState('2')}>
              <Text isWhite isBold style={styles.mapViewText}>
                قبول الطلب
              </Text>
            </Button>
            <Button isTransparent onPress={() => ChangeOrderState('3')}>
              <Text isBold isPrimary>
                رفض الطلب
              </Text>
            </Button>
          </View>
        ) : Order?.driver_status < 3 ? (
          <View>
            <Button isLoading={ROrders.loading} onPress={() => ChangeOrderState('6')}>
              <Text isWhite isBold isSecondary>
                تم توصيل الطلب
              </Text>
            </Button>
            <Button isTransparent onPress={() => ChangeOrderState('7')}>
              <Text isBold isPrimary>
                رفض الاستلام
              </Text>
            </Button>
          </View>
        ) : null}
      </Container>
    </Dialog>
  );
};

export default TrackOrderModal;
