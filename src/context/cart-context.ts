import * as React from 'react';
import {Dish, Place} from '@src/data/mock-places';

export type CartItem = {
  dish: Dish;
  sideDishes: Dish[];
  qty: number;
  note: String;
  subtotalPrice: number;
  resturant: any,
};

export type CartState = {
  cartItems: CartItem[];
  updateCartItems: (items: CartItem[], totlaPrice: number, resturant: any) => void;
  totalPrice: number;
  clearCart: () => void;
  resturant: any;
};

const initialCartState: CartState = {
  cartItems: [],
  updateCartItems: () => {},
  totalPrice: 0,
  clearCart: () => {},
  resturant: {},
};

export default React.createContext(initialCartState);
