'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Context = createContext()

const customServices = [
  {
    id: 1,
    title: 'Website Development',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1776327384/bg_t5alxh.jpg',
    sections: [
      {
        id: 1,
        title: 'Responsive Web Design',
        description: 'Creating fluid, high-performance interfaces that adapt perfectly to desktops, tablets, and smartphones for a consistent user experience.'
      },
      {
        id: 2,
        title: 'SEO & Performance',
        description: 'Optimizing site architecture and speed to ensure high search engine rankings and lightning-fast page transitions.'
      },
      {
        id: 3,
        title: 'CMS Integration',
        description: 'Empowering teams with intuitive Content Management Systems like WordPress or custom-built headless solutions for easy updates.'
      },
      {
        id: 4,
        title: 'E-commerce Solutions',
        description: 'Full-scale online stores featuring secure payment gateways, inventory tracking, and seamless customer checkout experiences.'
      },
      {
        id: 5,
        title: 'Web Security & SSL',
        description: 'Implementing robust security protocols, data encryption, and SSL certificates to protect user data and build brand trust.'
      },
      {
        id: 6,
        title: 'API Development',
        description: 'Building custom RESTful or GraphQL APIs to connect your website with third-party services and mobile applications.'
      }
    ]
  },
  {
    id: 2,
    title: 'Mobile App Development',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/q_auto/f_auto/v1776327517/mobile_app_disibin_dvtpeb.png',
    sections: [
      {
        id: 1,
        title: 'Cross-Platform Solutions',
        description: 'Building native-quality applications for both iOS and Android from a single codebase using React Native or Flutter.'
      },
      {
        id: 2,
        title: 'Push Notifications & Alerts',
        description: 'Real-time engagement tools that keep users informed and drive retention through personalized, timely updates.'
      },
      {
        id: 3,
        title: 'Offline Capabilities',
        description: 'Advanced data caching and local storage mechanisms that allow your application to function even without an active internet connection.'
      },
      {
        id: 4,
        title: 'User Authentication',
        description: 'Secure biometric login, social media integration, and multi-factor authentication (MFA) for maximum user privacy.'
      },
      {
        id: 5,
        title: 'UI/UX Interactive Prototyping',
        description: 'Crafting pixel-perfect designs with smooth animations and intuitive gestures to ensure a delightfull mobile journey.'
      },
      {
        id: 6,
        title: 'App Store Optimization (ASO)',
        description: 'Strategic deployment and keyword optimization to ensure your app ranks higher in the Apple App Store and Google Play.'
      }
    ]
  },
  {
    id: 3,
    title: 'Business Automation',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/q_auto/f_auto/v1776327518/automation-disibin_usyqyd.png',
    sections: [
      {
        id: 1,
        title: 'Workflow Orchestration',
        description: 'Connecting disparate software tools to automate repetitive tasks, eliminating manual data entry and human error.'
      },
      {
        id: 2,
        title: 'AI-Powered Chatbots',
        description: 'Implementing intelligent virtual assistants to handle customer inquiries 24/7, improving response times and lead qualification.'
      },
      {
        id: 3,
        title: 'Data Flow & Integration',
        description: 'Seamlessly syncing data between CRM, ERP, and marketing platforms to provide a unified "source of truth" for your business.'
      },
      {
        id: 4,
        title: 'Email Marketing Automation',
        description: 'Automated drip campaigns and behavior-triggered emails that nurture leads without requiring manual intervention.'
      },
      {
        id: 5,
        title: 'Automated Reporting',
        description: 'Dynamic dashboards that automatically compile and send performance reports to stakeholders on a daily or weekly basis.'
      },
      {
        id: 6,
        title: 'Legacy System Integration',
        description: 'Modernizing older infrastructure by building bridges between legacy databases and modern cloud-based applications.'
      }
    ]
  }
];

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
        if (!pack?.packageId) return;

        const existingInwishlist = wishlist.items.find(item => item.packageId === pack.packageId);

        if (existingInwishlist) {
            alert('Item already in wishlist')
        } else {
            const salePrice = parseFloat(pack?.price) || 0;
            const discountPrice = parseFloat(pack?.discount) || 0;

            setWishList((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        packageId: pack.packageId,
                        image: pack.image,
                        title: pack.title,
                        slug: pack.slug,
                        price: salePrice,
                        discount: discountPrice,
                    }
                ]
            }));
            alert("Added to wishlist");
        }
    };

    const removeFromwishlist = (id) => {
        const confirm = window.confirm('Are you sure?')
        if (!confirm) return
        setWishList(prev => ({
            ...prev,
            items: prev.items.filter(item => item.packageId !== id)
        }))
    }

    const clearWishlist = () => {
        setWishList({ items: [] });
        if (typeof window !== 'undefined') localStorage.removeItem('wishlist');
    }

     const handleLogout=async()=>{
        try {
          const res= await axios.get('/api/user/logout',{withCredentials:true})
          alert(res.data.message)
          window.location.replace('/login')
        } catch (error) {
          console.log(error)
          alert('Failed to logout')
        }
      }

    const contextValues = {
        sidebar, setSidebar, isLoggedin, userData, removeFromwishlist, addToWishList, wishlist, clearWishlist, customServices, handleLogout
    }

    return (
        <Context.Provider value={contextValues}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider
