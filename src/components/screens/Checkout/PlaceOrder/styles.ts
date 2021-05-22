import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  placeOrderContainer: {
    padding: 10,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalPriceText: {
    fontSize: 16,
  },
  totalPriceDiscount: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  placeOrderText: {
    fontSize: 16,
    color: 'white',
  },
});
