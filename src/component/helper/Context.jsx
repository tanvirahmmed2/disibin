'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Context = createContext()


const ContextProvider = ({ children }) => {
    const [sidebar, setSidebar] = useState(false)
    const [isLoggedin, setIsLogggedin] = useState(false)
    const [userData, setUserData] = useState([])

    const [hydrated, setHydrated] = useState(false)
    const [cart, setCart] = useState({ items: [] })

    useEffect(() => {
        const fetchLogin = async () => {
            try {
                const res = await axios.get('/api/user/islogin', { withCredentials: true })
                if (!res.data.success) {
                    setIsLogggedin(false)
                }
                setIsLogggedin(true)
                setUserData(res.data.payload)
            } catch (error) {
                setIsLogggedin(false)
                setUserData([])
            }
        }
        fetchLogin()
    }, [])


    const fetchCart = () => {
        if (typeof window === 'undefined') return
        const storedCart = localStorage.getItem('cart')

        if (!storedCart || storedCart === 'undefined') {
            setCart({ items: [] })
            setHydrated(true)
            return
        }

        try {
            const parsed = JSON.parse(storedCart)
            if (parsed && Array.isArray(parsed.items)) {
                setCart(parsed)
            } else {
                setCart({ items: [] })
            }
        } catch (err) {
            localStorage.removeItem('cart')
            setCart({ items: [] })
        }
        setHydrated(true)
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && hydrated) {
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    }, [cart, hydrated])

    const addToCart = (product) => {
        if (!product?.product_id) return;

        if (Number(product.stock) <= 0) {
            toast.error("Item is out of stock!");
            return;
        }

        const existingInCart = cart.items.find(item => item.product_id === product.product_id);

        if (existingInCart) {
            if (existingInCart.quantity >= Number(product.stock)) {
                toast.warning(`Only ${product.stock} items available in stock`);
                return;
            }

            setCart((prev) => ({
                ...prev,
                items: prev.items.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }));
            toast.info("Quantity increased");
        } else {
            const salePrice = parseFloat(product?.sale_price) || 0;
            const wholeSalePrice = parseFloat(product?.wholesale_price) || 0;
            const discountAmount = parseFloat(product?.discount_price) || 0;

            setCart((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        product_id: product.product_id,
                        name: product.name,
                        quantity: 1,
                        sale_price: salePrice,
                        wholesale_price: wholeSalePrice,
                        discount_price: discountAmount,
                        price: salePrice
                    }
                ]
            }));
            toast.success("Added to cart");
        }
    };
    const removeFromCart = (id) => {
        setCart(prev => ({ ...prev, items: prev.items.filter(item => item.product_id !== id) }))
    }


    const contextValues = {
        sidebar, setSidebar, isLoggedin, userData
    }

    return <Context.Provider value={contextValues}>
        {children}
    </Context.Provider>

}

export default ContextProvider