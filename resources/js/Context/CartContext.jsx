import PropTypes from 'prop-types';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';

const CartContext = createContext();

// Reducer to manage cart state
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return action.cart;
        case 'ADD': {
            const existingItem = state.find(
                (item) => item.id === action.product.id,
            );
            if (existingItem) {
                return state.map((item) =>
                    item.id === action.product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            } else {
                return [...state, { ...action.product, quantity: 1 }];
            }
        }
        case 'UPDATE_QUANTITY':
            return state.map((item) =>
                item.id === action.productId
                    ? { ...item, quantity: action.quantity }
                    : item,
            );
        case 'REMOVE':
            return state.filter((item) => item.id !== action.productId);
        case 'CLEAR':
            return [];
        default:
            return state;
    }
};

// Helper function to get CSRF token
const getCsrfToken = () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) throw new Error('CSRF Token not found!');
    return csrfToken.content;
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);

    // Fetch cart from server
    const fetchCart = useCallback(async () => {
        try {
            const response = await fetch('/cart/get');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const newCart = data.cart.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            }));
            dispatch({ type: 'SET_CART', cart: newCart });
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Use a notification component instead of alert
            showNotification(
                'Failed to fetch cart. Please check your network connection.',
                'error',
            );
        }
    }, []);

    // Add product to cart
    const addToCart = async (product) => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ product_id: product.id }),
            });

            if (response.ok) {
                await fetchCart();
                return true;
            } else {
                const data = await response.json();
                showNotification(
                    data.message || 'Failed to add product to cart',
                    'error',
                );
                return false;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('An error occurred: ' + error.message, 'error');
            return false;
        }
    };

    // Update product quantity in cart
    const updateQuantity = async (productId, quantity) => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('/cart/update-quantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ product_id: productId, quantity }),
            });

            if (response.ok) {
                await fetchCart();
            } else {
                const data = await response.json();
                showNotification(
                    data.message || 'Failed to update quantity',
                    'error',
                );
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            showNotification('An error occurred: ' + error.message, 'error');
        }
    };

    // Remove product from cart
    const removeFromCart = async (productId) => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ product_id: productId }),
            });

            if (response.ok) {
                await fetchCart();
            } else {
                const data = await response.json();
                showNotification(
                    data.message || 'Failed to remove product from cart',
                    'error',
                );
            }
        } catch (error) {
            console.error('Error removing item:', error);
            showNotification('An error occurred: ' + error.message, 'error');
        }
    };

    // Fetch cart on provider load
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                fetchCart,
                dispatch,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook to access the CartContext
export const useCart = () => useContext(CartContext);

// Mock notification function
const showNotification = (message, type) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
};
