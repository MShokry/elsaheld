import * as React from 'react';
import {Animated, SafeAreaView, View, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import {Text, Button} from '@src/components/elements';
import {mockDishDetails, Dish} from '@src/data/mock-places';
import CartContext from '@src/context/cart-context';
import HeadingInformation from './HeadingInformation';
import SideDishes from './SideDishes';
import AddToBasketForm from './AddToBasketForm';
import {formatCurrency} from '@src/utils/number-formatter';
import styles from './styles';
import {baseImages} from '@src/utils/APICONST';

type DishDetailsProps = {};

export const DishDetails: React.FC<DishDetailsProps> = ({route}) => {
  const DishData = route.params;
  // console.log(DishData,resturant);

  const [totalPrice, setTotalPrice] = React.useState(parseFloat(DishData?.price));
  const [selectedSideDishes, setSelectedSideDishes] = React.useState<Dish[]>([]);
  const [totalAmount, setTotalAmount] = React.useState(1);
  const [message, setMessage] = React.useState('');
  const [scrollY] = React.useState(new Animated.Value(0));
  const {
    colors: {background},
  } = useTheme();
  const {goBack} = useNavigation();
  const {updateCartItems, cartItems, resturant} = React.useContext(CartContext);
  console.log('cartItems', cartItems);

  const addSideDishToBasket = React.useCallback(
    (dish: Dish) => {
      setSelectedSideDishes(dish);
    },
    [selectedSideDishes, totalPrice],
  );
  // const addSideDishToBasket = React.useCallback(
  //   (dish: Dish) => {
  //     const existedDishIndex = selectedSideDishes.find(
  //       (item: Dish) => item.ID === dish.ID,
  //     );
  //     if (existedDishIndex) {
  //       setSelectedSideDishes(
  //         selectedSideDishes.filter((item: Dish) => item.ID !== dish.ID),
  //       );
  //       // setTotalPrice(totalPrice - parseFloat(existedDishIndex.price));
  //       // updateTotalDishAmount(totalAmount);
  //     } else {
  //       setSelectedSideDishes([...selectedSideDishes, dish]);
  //       // setTotalPrice(totalPrice + parseFloat(dish.price));
  //     }
  //   },
  //   [selectedSideDishes, totalPrice],
  // );

  React.useEffect(() => {
    updateTotalDishAmount(totalAmount);
  }, [selectedSideDishes]);

  const updateTotalDishAmount = React.useCallback(
    (amount: number) => {
      const totalSelectedDishPrice = selectedSideDishes.reduce(
        (prevValue, currentValue) => prevValue + parseFloat(currentValue.price) * (currentValue.Amount || 1),
        0,
      );
      console.log('selectedSideDishes==', selectedSideDishes, 'DishData', DishData);
      if (DishData.DefaultPrice === 1) {
        setTotalPrice(parseFloat(totalSelectedDishPrice) * amount);
      } else {
        setTotalPrice(parseFloat(DishData.price) * amount + parseFloat(totalSelectedDishPrice) * amount);
      }
    },
    [selectedSideDishes],
  );

  const totalCart = cartItems.reduce(
    (prevValue, currentValue) => prevValue + parseFloat(currentValue.subtotalPrice),
    0,
  );
  console.log('totalCart', totalCart);

  console.log('cartItems', cartItems);
  const onAddToBasketButtonPressed = () => {
    console.log(resturant);
    if (resturant?.ID && DishData.Resturant?.ID !== resturant.ID && cartItems.length) {
      Alert.alert('خطئ', 'برجاء مسح المنتجات من السلة او انهاء الطلب اولا ');
    } else {
      updateCartItems(
        [
          ...cartItems,
          {
            dish: DishData,
            qty: totalAmount,
            note: message,
            sideDishes: selectedSideDishes,
            subtotalPrice: totalPrice,
          },
        ],
        totalPrice,
        DishData.Resturant,
      );
      goBack();
    }
  };

  const coverTranslateY = scrollY.interpolate({
    inputRange: [-4, 0, 10],
    outputRange: [-2, 0, 3],
  });

  const coverScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [2, 1],
    extrapolateRight: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.rootContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          enabled>
          <Animated.ScrollView
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollY,
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}>
            <Animated.View
              style={[
                styles.coverPhotoContainer,
                {
                  transform: [
                    {
                      translateY: coverTranslateY,
                    },
                  ],
                },
              ]}>
              <Animated.Image
                source={DishData.photo ? {uri: `${baseImages}${DishData.photo}`} : {}}
                style={[
                  styles.coverPhoto,
                  {
                    transform: [
                      {
                        scale: coverScale,
                      },
                    ],
                  },
                ]}
              />
            </Animated.View>
            <HeadingInformation data={DishData} />
            <SideDishes data={DishData} addSideDishToBasket={addSideDishToBasket} />
            <AddToBasketForm
              message={message}
              setMessage={setMessage}
              totalAmount={totalAmount}
              setTotalAmount={setTotalAmount}
              updateTotalDishAmount={updateTotalDishAmount}
            />
          </Animated.ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.addToBasketButtonContainer}>
          <Button childrenContainerStyle={styles.addToBasketButton} onPress={onAddToBasketButtonPressed}>
            <Text style={styles.addToBasketButtonText}>اضف للسلة - {formatCurrency(totalPrice)}</Text>
          </Button>
        </View>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              backgroundColor: background,
            },
          ]}>
          <Text style={styles.headerTitle}>{DishData.name}</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default DishDetails;
