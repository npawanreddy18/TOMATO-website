import { createContext, useEffect, useState } from 'react';
import { food_list } from '../assets/assets';

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState({});


    // =========================================
    // ADD ITEM
    // =========================================

    const addToCart = (itemId) => {

        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId]
                ? prev[itemId] + 1
                : 1
        }));

    };


    // =========================================
    // REMOVE ONE QUANTITY
    // =========================================

    const removeFromCart = (itemId) => {

        setCartItems((prev) => {

            const updatedCart = {
                ...prev
            };

            if (updatedCart[itemId] > 1) {

                updatedCart[itemId] -= 1;

            } else {

                delete updatedCart[itemId];

            }

            return updatedCart;

        });

    };


    // =========================================
    // REMOVE COMPLETE ITEM
    // =========================================

    const removeItem = (itemId) => {

        setCartItems((prev) => {

            const updatedCart = {
                ...prev
            };

            delete updatedCart[itemId];

            return updatedCart;

        });

    };


    // =========================================
    // SHOW CART IN CONSOLE
    // =========================================

    useEffect(() => {

        console.log('Cart:', cartItems);

    }, [cartItems]);


    // =========================================
    // CONTEXT VALUE
    // =========================================

    const contextValue = {

        food_list,

        cartItems,

        setCartItems,

        addToCart,

        removeFromCart,

        removeItem

    };


    return (

        <StoreContext.Provider value={contextValue}>

            {children}

        </StoreContext.Provider>

    );

};

export default StoreContextProvider;