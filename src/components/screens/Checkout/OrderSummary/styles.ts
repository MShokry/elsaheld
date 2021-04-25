import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  menuContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuInfo: {
    flexDirection: 'row',
    width:'60%',
  },
  mainDishText: {
    marginBottom: 5,
    flexWrap:'nowrap',
  },
  sideDishText: {
    marginBottom: 2,
  },
  quantityText: {
    marginRight: 10,
  },
  priceContainer: {
    padding: 10,
  },
  subTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryFee: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
