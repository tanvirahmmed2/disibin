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
                if (res.data.success) {
                    setIsLogggedin(true)
                    setUserData(res.data.payload)
                } else {
                    setIsLogggedin(false)
                    setUserData([])
                }
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
        fetchWishList()
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined' && hydrated) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist))
        }
    }, [wishlist, hydrated])

    const addToWishList = (pack) => {
        if (!pack?.package_id) return;

        const existingInwishlist = wishlist.items.find(item => item.package_id === pack.package_id);

        if (existingInwishlist) {
            alert('Please checkout in your wishlist')
        } else {
            const salePrice = parseFloat(pack?.price) || 0;
            const discountPrice = parseFloat(pack?.discount) || 0;

            setWishList((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        package_id: pack.package_id,
                        title: pack.title,
                        price: salePrice,
                        discount: discountPrice,
                    }
                ]
            }));
            alert("Added to wishlist");
        }
    };

    const removeFromwishlist = (id) => {
        setWishList(prev => ({ 
            ...prev, 
            items: prev.items.filter(item => item.package_id !== id) 
        }))
    }

    const contextValues = {
        sidebar, setSidebar, isLoggedin, userData, removeFromwishlist, addToWishList, wishlist, hydrated
    }

    return (
        <Context.Provider value={contextValues}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider