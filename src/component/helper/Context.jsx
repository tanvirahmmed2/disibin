'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Context = createContext()


const ContextProvider = ({ children }) => {
    const [sidebar, setSidebar] = useState(false)
    const [isLoggedin, setIsLogggedin] = useState(false)
    const [userData, setUserData] = useState([])

    const [hydrated, setHydrated] = useState(false)
    const [wishlist, setWishList] = useState({ items: [] })

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


    const fetchWishList = () => {
        if (typeof window === 'undefined') return
        const storedwishlist = localStorage.getItem('wishlist')

        if (!storedwishlist || storedwishlist === 'undefined') {
            setWishList({ items: [] })
            setHydrated(true)
            return
        }

        try {
            const parsed = JSON.parse(storedwishlist)
            if (parsed && Array.isArray(parsed.items)) {
                setWishList(parsed)
            } else {
                setWishList({ items: [] })
            }
        } catch (err) {
            localStorage.removeItem('wishlist')
            setWishList({ items: [] })
        }
        setHydrated(true)
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && hydrated) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist))
        }
    }, [wishlist, hydrated])

    const addToWishList = (pack) => {
        if (!pack?.pack_id) return;

        if (Number(pack.stock) <= 0) {
            toast.error("Item is out of stock!");
            return;
        }

        const existingInwishlist = wishlist.items.find(item => item.pack_id === pack.pack_id);

        if (existingInwishlist) {
            if (existingInwishlist.quantity >= Number(pack.stock)) {
                toast.warning(`Only ${pack.stock} items available in stock`);
                return;
            }

            setWishList((prev) => ({
                ...prev,
                items: prev.items.map(item =>
                    item.pack_id === pack.pack_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }));
            toast.info("Quantity increased");
        } else {
            const salePrice = parseFloat(pack?.sale_price) || 0;
            const wholeSalePrice = parseFloat(pack?.wholesale_price) || 0;
            const discountAmount = parseFloat(pack?.discount_price) || 0;

            setwishlist((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        pack_id: pack.pack_id,
                        name: pack.name,
                        quantity: 1,
                        sale_price: salePrice,
                        wholesale_price: wholeSalePrice,
                        discount_price: discountAmount,
                        price: salePrice
                    }
                ]
            }));
            toast.success("Added to wishlist");
        }
    };
    const removeFromwishlist = (id) => {
        setwishlist(prev => ({ ...prev, items: prev.items.filter(item => item.pack_id !== id) }))
    }


    const contextValues = {
        sidebar, setSidebar, isLoggedin, userData
    }

    return <Context.Provider value={contextValues}>
        {children}
    </Context.Provider>

}

export default ContextProvider