import * as React from 'react';
import { ScrollView, View, Animated, Alert, Image } from 'react-native';
import DeliveryTime from './DeliveryTime';
import DeliveryStep from './DeliveryStep';
import DriverInformation from './DriverInformation';
import { Divider, Container, Button, Text, Dialog } from '@src/components/elements';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import DeliveryMapView from './DeliveryMapView';
import CartContext from '@src/context/cart-context';
import { GetOrders, ReOrders, CancelOrders } from '@src/utils/CartAPI';
import { baseImages } from '@src/utils/APICONST';

type TrackOrderModalProps = {
  isVisible: boolean;
  setIsVisble: (value: React.SetStateAction<boolean>) => void;
  Order: Object;
};

const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isVisible,
  Order,
  setIsVisble,
}) => {
  const navigation = useNavigation();
  const [isMapViewVisible, setIsMapViewVisible] = React.useState(false);
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const fadeOut = React.useRef(new Animated.Value(1)).current;
  const [isAnimationFinished, setIsAnimationFinished] = React.useState(false);
  const [ROrders, setROrders] = React.useState({ error: '', results: {}, loading: true });

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
  const { clearCart } = React.useContext(CartContext);

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
  const _CancelOrder = (id) => {
    Alert.alert(
      'الغاء الطلب',
      'هل تريد الغاء الطلب ؟',
      [{
        text: 'تاكيد',
        style: 'cancel',
        onPress: () => {
          CancelOrders(id, setROrders);
        }
      },
      { text: 'عودة' },]
    )
  }

  const _ReOrder = (id) => {
    ReOrders(id, setROrders);
    // otherModal(true);
  }

  const { ID, status, RestaurantName, itemsAmount, items, total, History, Cancelled } = Order;
  return (
    <Dialog isVisible={isVisible} onBackdropPress={_onBackdropPress}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainerStyle}>
        <Container>
          <DeliveryTime />
          <Divider />
          <DriverInformation />
        </Container>
        {/* {isMapViewVisible ? <DeliveryMapView /> : <DeliveryStep />} */}
        {!isMapViewVisible ? items?.map((cartItem, cartItemIndex) => (<>
          <View key={cartItemIndex.toString()} style={styles.menuContainer}>
            <Image source={{ uri: `${baseImages}${cartItem.MainItemPhoto}` }} style={{
              width: 60,
              height: 60,
            }} />
            <View style={styles.menuInfo}>
              <Text style={styles.quantityText}>{`${cartItem.Amount}`}</Text>
              <View key={cartItemIndex}>
                <Text style={styles.mainDishText} isBold>
                  {cartItem.ItemName}
                </Text>
                <Text isSecondary style={styles.sideDishText}>
                  {cartItem.SubItemsNames}
                </Text>
              </View>
            </View>
            <Text isBold>{cartItem.subtotalPrice}</Text>
          </View>
          <Divider />
        </>)) : History?.map((cartItem, cartItemIndex) => (<>
          <View key={cartItemIndex} style={styles.menuContainer}>
            <View style={styles.menuInfo}>
              <View key={cartItemIndex}>
                <Text style={styles.mainDishText} isBold>
                  {cartItem.Title}
                </Text>
                <Text isSecondary style={styles.sideDishText}>
                  {cartItem.AddDate}
                </Text>
              </View>
            </View>
            <Text isBold>{cartItem.subtotalPrice}</Text>
          </View>
          <Divider />
        </>))}

      </ScrollView>
      <Container style={styles.footerButtonContainer}>
        <Button isFullWidth onPress={_onMapViewButtonPressed}>
          <Text isWhite isBold style={styles.mapViewText}>
            {!isMapViewVisible ? 'محتويات الطلب' : 'حالة الطلب'}
          </Text>
        </Button>
        {/* <Button
          isFullWidth
          isTransparent
          onPress={() => _CancelOrder(Order.ID)}
          style={styles.cancelOrderButton}>
          <Text>Cancel your order</Text>
        </Button> */}
        {status == 1 && Cancelled == 0 ? (
          <Button isTransparent onPress={() => _CancelOrder(ID)}>
            <Text isBold isPrimary>
              الغاء الطلب
          </Text>
          </Button>
        ) : (
          <Button isTransparent onPress={() => _ReOrder(ID)}>
            <Text isBold isSecondary>
              اعادة الطلب
          </Text>
          </Button>
        )}
      </Container>
    </Dialog>
  );
};

export default TrackOrderModal;
