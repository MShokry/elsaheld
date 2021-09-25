import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  menuContainer: {
    padding: 10,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuInfo: {
    flexDirection: 'row',
    width: '60%',
  },
  mainDishText: {
    marginBottom: 5,
    flexWrap: 'nowrap',
  },
  sideDishText: {},
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  quantityText: {
    marginRight: 10,
    direction: 'rtl',
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
  button: {
    height: 30,
    width: 100,
    marginLeft: 70 + 40,
    padding: 0,
    marginTop: -5,
    marginBottom: 10,
  },
  buttonItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    height: 25,
  },
});
