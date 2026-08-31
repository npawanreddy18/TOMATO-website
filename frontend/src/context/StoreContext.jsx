import {
    createContext,
    useEffect,
    useMemo,
    useState
} from "react";

import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {

    /* =========================================
       CART
    ========================================= */

    const [cartItems, setCartItems] = useState(() => {

        try {

            const savedCart =
                localStorage.getItem("tomato-cart");

            return savedCart
                ? JSON.parse(savedCart)
                : {};

        } catch (error) {

            console.error(
                "Could not load cart:",
                error
            );

            return {};

        }

    });


    /* =========================================
       SEARCH
    ========================================= */

    const [searchTerm, setSearchTerm] =
        useState("");


    /* =========================================
       SAVE CART
    ========================================= */

    useEffect(() => {

        localStorage.setItem(
            "tomato-cart",
            JSON.stringify(cartItems)
        );

    }, [cartItems]);


    /* =========================================
       ADD ITEM
    ========================================= */

    const addToCart = (itemId) => {

        setCartItems((previous) => ({

            ...previous,

            [itemId]:
                (previous[itemId] || 0) + 1

        }));

    };


    /* =========================================
       REMOVE ONE QUANTITY
    ========================================= */

    const removeFromCart = (itemId) => {

        setCartItems((previous) => {

            const updated = {
                ...previous
            };

            if (!updated[itemId]) {
                return updated;
            }

            updated[itemId] =
                updated[itemId] - 1;

            if (updated[itemId] <= 0) {

                delete updated[itemId];

            }

            return updated;

        });

    };


    /* =========================================
       REMOVE COMPLETE ITEM
    ========================================= */

    const removeItem = (itemId) => {

        setCartItems((previous) => {

            const updated = {
                ...previous
            };

            delete updated[itemId];

            return updated;

        });

    };


    /* =========================================
       CLEAR CART
    ========================================= */

    const clearCart = () => {

        setCartItems({});

    };


    /* =========================================
       CART ITEM COUNT
    ========================================= */

    const cartCount = useMemo(() => {

        return Object.values(cartItems).reduce(
            (total, quantity) =>
                total + Number(quantity),
            0
        );

    }, [cartItems]);


    /* =========================================
       SUBTOTAL
    ========================================= */

    const cartSubtotal = useMemo(() => {

        return food_list.reduce(
            (total, item) => {

                const quantity =
                    cartItems[item._id] || 0;

                return (
                    total +
                    Number(item.price) *
                    Number(quantity)
                );

            },
            0
        );

    }, [cartItems]);


    /* =========================================
       DELIVERY FEE
    ========================================= */

    const deliveryFee =
        cartSubtotal > 0 ? 2 : 0;


    /* =========================================
       TOTAL
    ========================================= */

    const cartTotal =
        cartSubtotal + deliveryFee;


    /* =========================================
       CONTEXT VALUE
    ========================================= */

    const contextValue = {

        food_list,

        cartItems,
        setCartItems,

        addToCart,
        removeFromCart,
        removeItem,
        clearCart,

        searchTerm,
        setSearchTerm,

        cartCount,

        cartSubtotal,

        deliveryFee,

        cartTotal

    };


    return (

        <StoreContext.Provider
            value={contextValue}
        >

            {children}

        </StoreContext.Provider>

    );

};

export default StoreContextProvider;