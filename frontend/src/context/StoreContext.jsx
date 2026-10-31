import {
    createContext,
    useEffect,
    useMemo,
    useState
} from "react";

export const StoreContext = createContext(null);

const API_URL = "https://tomato-backend-dgur.onrender.com";

const defaultSettings = {
    restaurantName: "Tomato",
    email: "",
    phone: "",
    deliveryFee: 2,
    minOrder: 0,
    currency: "$",
    notifications: true,
    emailNotifications: true,
    autoConfirm: false
};

const StoreContextProvider = ({ children }) => {

    // =====================================================
    // CART
    // =====================================================

    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart =
                localStorage.getItem("tomato-cart");

            return savedCart
                ? JSON.parse(savedCart)
                : {};
        } catch {
            return {};
        }
    });


    // =====================================================
    // FOOD
    // =====================================================

    const [food_list, setFoodList] = useState([]);

    const [foodLoading, setFoodLoading] =
        useState(true);

    const [foodError, setFoodError] =
        useState("");


    // =====================================================
    // SEARCH
    // =====================================================

    const [searchTerm, setSearchTerm] =
        useState("");


    // =====================================================
    // RESTAURANT SETTINGS
    // =====================================================

    const [settings, setSettings] =
        useState(defaultSettings);

    const [settingsLoading, setSettingsLoading] =
        useState(true);


    // =====================================================
    // SAVE CART
    // =====================================================

    useEffect(() => {

        localStorage.setItem(
            "tomato-cart",
            JSON.stringify(cartItems)
        );

    }, [cartItems]);


    // =====================================================
    // GET FOOD
    // =====================================================

    const fetchFood = async () => {

        try {

            setFoodLoading(true);
            setFoodError("");

            const response = await fetch(
                `${API_URL}/api/food/list`
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Failed to load food"
                );
            }

            setFoodList(
                data.foods || []
            );

        } catch (error) {

            console.error(
                "Food loading error:",
                error
            );

            setFoodError(
                error.message ||
                "Unable to load food"
            );

        } finally {

            setFoodLoading(false);
        }
    };


    // =====================================================
    // GET RESTAURANT SETTINGS
    // =====================================================

    const fetchSettings = async () => {

        try {

            setSettingsLoading(true);

            const response = await fetch(
                `${API_URL}/api/settings`
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to load settings"
                );
            }

            const newSettings = {
                ...defaultSettings,
                ...data.settings
            };

            setSettings(newSettings);

            localStorage.setItem(
                "tomato-settings",
                JSON.stringify(newSettings)
            );

        } catch (error) {

            console.error(
                "Settings loading error:",
                error
            );

            try {

                const savedSettings =
                    localStorage.getItem(
                        "tomato-settings"
                    );

                if (savedSettings) {

                    setSettings({
                        ...defaultSettings,
                        ...JSON.parse(
                            savedSettings
                        )
                    });

                }

            } catch {

                setSettings(
                    defaultSettings
                );
            }

        } finally {

            setSettingsLoading(false);
        }
    };


    // =====================================================
    // LOAD FOOD + SETTINGS
    // =====================================================

    useEffect(() => {

        fetchFood();
        fetchSettings();

    }, []);


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = (itemId) => {

        setCartItems((previous) => ({

            ...previous,

            [itemId]:
                (previous[itemId] || 0) + 1

        }));
    };


    // =====================================================
    // REMOVE ONE
    // =====================================================

    const removeFromCart = (itemId) => {

        setCartItems((previous) => {

            const next = {
                ...previous
            };

            if (!next[itemId]) {
                return next;
            }

            next[itemId] -= 1;

            if (next[itemId] <= 0) {
                delete next[itemId];
            }

            return next;
        });
    };


    // =====================================================
    // REMOVE ENTIRE ITEM
    // =====================================================

    const removeItem = (itemId) => {

        setCartItems((previous) => {

            const next = {
                ...previous
            };

            delete next[itemId];

            return next;
        });
    };


    // =====================================================
    // CLEAR CART
    // =====================================================

    const clearCart = () => {

        setCartItems({});

    };


    // =====================================================
    // CART COUNT
    // =====================================================

    const cartCount = useMemo(() => {

        return Object.values(
            cartItems
        ).reduce(
            (total, quantity) =>
                total + Number(quantity),
            0
        );

    }, [cartItems]);


    // =====================================================
    // CART SUBTOTAL
    // =====================================================

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

    }, [food_list, cartItems]);


    // =====================================================
    // DELIVERY FEE FROM ADMIN SETTINGS
    // =====================================================

    const deliveryFee = useMemo(() => {

        if (cartSubtotal <= 0) {
            return 0;
        }

        return Number(
            settings.deliveryFee
        ) || 0;

    }, [
        cartSubtotal,
        settings.deliveryFee
    ]);


    // =====================================================
    // CART TOTAL
    // =====================================================

    const cartTotal = useMemo(() => {

        return (
            Number(cartSubtotal) +
            Number(deliveryFee)
        );

    }, [
        cartSubtotal,
        deliveryFee
    ]);


    // =====================================================
    // MINIMUM ORDER
    // =====================================================

    const minimumOrder = Number(
        settings.minOrder
    ) || 0;

    const minimumOrderReached =
        cartSubtotal >= minimumOrder;


    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const contextValue = {

        // Cart
        cartItems,
        setCartItems,

        addToCart,
        removeFromCart,
        removeItem,
        clearCart,

        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,

        // Food
        food_list,
        foodLoading,
        foodError,
        fetchFood,

        // Search
        searchTerm,
        setSearchTerm,

        // Settings
        settings,
        settingsLoading,
        fetchSettings,

        // Individual settings
        restaurantName:
            settings.restaurantName,

        currency:
            settings.currency,

        minimumOrder,

        minimumOrderReached
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