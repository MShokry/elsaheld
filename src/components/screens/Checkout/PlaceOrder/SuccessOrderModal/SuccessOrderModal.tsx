import * as React from 'react';
import {View, Animated, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Container, Text, Button, Dialog} from '@src/components/elements';
import CartContext from '@src/context/cart-context';
import styles from './styles';

type OrderSuccessModalProps = {
  isVisible: boolean;
  setIsVisble: (value: React.SetStateAction<boolean>) => void;
  type?: string;
  data?: any;
};

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({isVisible, setIsVisble, type, data, pay}) => {
  const navigation = useNavigation();
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const fadeOut = React.useRef(new Animated.Value(1)).current;
  const [isAnimationFinished, setIsAnimationFinished] = React.useState(false);
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
  console.log(data);

  const _onBackdropPress = () => {
    setIsVisble(false);
    setIsAnimationFinished(false);
  };

  const _onOrderSomethingElseButtonPressed = () => {
    clearCart();
    setIsVisble(false);
    navigation.navigate('HomeScreen');
  };

  const _onTrackOrderButtonPressed = () => {
    clearCart();
    setIsVisble(false);
    navigation.navigate('Account');
    // navigation.dispatch(StackActions.replace('TrackOrderScreen'));
  };
  const _onPay = () => {
    Linking.openURL('https://www.elsahel.co/pay/index.php?orderID=' + data.OrderID).catch();
  };
  console.log(data);

  const renderType = () => {
    if (type === 'trip') {
      return (
        <Animated.View style={[styles.successMessageContainer, {opacity: fadeIn}]}>
          <Text isHeadingTitle isBold isPrimary>
            شكرا علي طلبك تم التاكيد
          </Text>
          <Text isCenter style={styles.successMessage}>
            رقم الطلب {data?.ID}
          </Text>
        </Animated.View>
      );
    }
    return (
      <Animated.View style={[styles.successMessageContainer, {opacity: fadeIn}]}>
        <Text isHeadingTitle isBold isPrimary>
          شكرا علي طلبك تم التاكيد
        </Text>
        <Text isCenter style={styles.successMessage}>
          يمكنك تتبع الطلب من قسم "طلباتي"
        </Text>
      </Animated.View>
    );
  };

  const renderAction = () => {
    if (type === 'trip') {
      return (
        <Animated.View style={[styles.footerButtonContainer, {opacity: fadeIn}]}>
          {/* <Button isFullWidth onPress={_onTrackOrderButtonPressed}>
          <Text isWhite isBold>
            تتبع الطلب
          </Text>
        </Button> */}
          <Button
            isFullWidth
            isTransparent
            style={styles.orderSomethingButton}
            onPress={_onOrderSomethingElseButtonPressed}>
            <Text>اطلب شئ اخر</Text>
          </Button>
        </Animated.View>
      );
    }
    return (
      <Animated.View style={[styles.footerButtonContainer, {opacity: fadeIn}]}>
        {pay && (
          <Button isFullWidth onPress={_onPay} style={{marginBottom: 10}}>
            <Text isWhite isBold>
              ادفع الطلب
            </Text>
          </Button>
        )}
        <Button isTransparent={pay ? true : false} isFullWidth onPress={_onTrackOrderButtonPressed}>
          <Text isWhite={pay ? false : true} isBold>
            تتبع الطلب
          </Text>
        </Button>
        <Button
          isFullWidth
          isTransparent
          style={styles.orderSomethingButton}
          onPress={_onOrderSomethingElseButtonPressed}>
          <Text>اطلب شئ اخر</Text>
        </Button>
      </Animated.View>
    );
  };
  return (
    <Dialog isVisible={isVisible} onBackdropPress={_onBackdropPress}>
      <Container style={styles.container}>
        <View style={styles.content}>
          <LottieView
            source={require('@src/assets/animations/order-success.json')}
            autoPlay
            loop={false}
            onAnimationFinish={_onAnimationFinish}
            style={styles.lottieView}
          />
          {!isAnimationFinished && (
            <Animated.View style={[styles.processingOrderContainer, {opacity: fadeOut}]}>
              <Text isBold>جاري معالجة الطلب ...</Text>
            </Animated.View>
          )}
          {renderType()}
        </View>
        {renderAction()}
      </Container>
    </Dialog>
  );
};
export default OrderSuccessModal;
