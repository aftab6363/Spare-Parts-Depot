import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const items = localStorage.getItem('cartItems');
        if (items) {
            setCartItems(JSON.parse(items));
        }
    }, []);

    const addToCart = (part, qty) => {
        const existItem = cartItems.find((x) => x._id === part._id);
        let newItems;
        if (existItem) {
            newItems = cartItems.map((x) =>
                x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
            );
        } else {
            newItems = [...cartItems, { ...part, qty }];
        }
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
    };

    const removeFromCart = (id) => {
        const newItems = cartItems.filter((x) => x._id !== id);
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
