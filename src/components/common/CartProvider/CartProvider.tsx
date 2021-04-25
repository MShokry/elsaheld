import * as React from 'react';
import CartContext, { CartItem } from '@src/context/cart-context';

type CartProviderProps = {};

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [resturant, setresturant] = React.useState({});

  const updateCartItems = React.useCallback(
    (items: CartItem[], total: number, resturant: any) => {
      setCartItems(items);
      const totalCart = items.reduce(
        (prevValue, currentValue) => prevValue + parseFloat(currentValue.subtotalPrice),
        0,
      );
      setTotalPrice(totalCart);
      setresturant(resturant);
    },
    [],
  );

  const removeCartItem = React.useCallback(
    (idx: number) => {
      const items = cartItems;
      console.log("itemsb4" ,items,idx);
      items.splice(idx,1);
      // delete items[idx];
      console.log("itemsTn",items,idx);
      
      // setCartItems(items);
      const totalCart = items.reduce(
        (prevValue, currentValue) => prevValue + parseFloat(currentValue.subtotalPrice),
        0,
      );
      setTotalPrice(totalCart);
    },
    [],
  );

  const clearCart = React.useCallback(() => {
    setCartItems([]);
    setTotalPrice(0);
    setresturant({});
  }, []);
  console.log(totalPrice);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateCartItems,
        removeCartItem,
        totalPrice,
        clearCart,
        resturant
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
