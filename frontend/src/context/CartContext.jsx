import { createContext, useState, useContext, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, variant = null) => {
        const item = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            variant: variant ? {
                color: variant.color_name,
                image: variant.image,
                availability: variant.is_available
            } : null,
            quantity: 1
        };

        setCartItems(prev => {
            const existing = prev.find(
                i => i.id === item.id && 
                i.variant?.color === item.variant?.color
            );
            if (existing) {
                return prev.map(i =>
                    i.id === item.id && i.variant?.color === item.variant?.color
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id, variantColor) => {
        setCartItems(prev =>
            prev.filter(
                i => !(i.id === id && i.variant?.color === variantColor)
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};