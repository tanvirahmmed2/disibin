'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAndroid, FaCode, FaFigma } from "react-icons/fa";

export const Context = createContext()


const services = [
  {
    id: 1,
    title: "Website Design",
    description: "Clean, modern, and user-friendly UI/UX designs focused on usability, branding, and seamless experience across all devices.",
    icon: <FaFigma />,
  },
  {
    id: 2,
    title: "Website Development",
    description: "High-performance, scalable websites built with clean code, best practices, and modern technologies for speed and reliability.",
    icon: <FaCode />,
  },
  {
    id: 3,
    title: "Android App Development",
    description: "Custom Android applications designed for performance, smooth user experience, and long-term maintainability.",
    icon: <FaAndroid />,
  },
];

const customServices = [
  {
    id: 1,
    title: 'Website Development',
    description: "We build modern, high-performance websites tailored to your business goals, combining responsive design, SEO optimization, and scalable architecture to deliver seamless user experiences across all devices. From dynamic business websites to full-featured eCommerce platforms, our solutions focus on speed, security, and usability, ensuring your digital presence is both visually compelling and technically robust. With support for CMS integration, custom APIs, and secure infrastructure, we create websites that are easy to manage, future-ready, and designed to grow with your business.",
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
    description: "Our mobile app development service focuses on creating powerful, user-centric applications that deliver smooth performance across both iOS and Android platforms. Using modern frameworks, we build scalable and feature-rich apps with intuitive UI/UX, secure authentication, and real-time capabilities such as push notifications and offline functionality. Whether it's a startup idea or an enterprise solution, we ensure your app is optimized for performance, engagement, and visibility in app stores, helping you connect effectively with your users anytime, anywhere.",
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
    description: "We help businesses increase efficiency and reduce manual workload by automating core processes through smart, integrated solutions. From workflow orchestration and AI-powered chatbots to data synchronization across multiple platforms, our automation systems streamline operations and improve accuracy. By implementing automated reporting, marketing workflows, and system integrations, we enable businesses to save time, minimize errors, and make data-driven decisions, ultimately enhancing productivity and scalability in a rapidly evolving digital environment.",
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
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false);
  const [isLoggedin, setIsLogggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [wishlist, setWishList] = useState([]);

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const res = await axios.get("/api/user/islogin", {
          withCredentials: true,
        });

        if (res.data.success) {
          setIsLogggedin(true);
          setUserData(res.data.data);
        } else {
          setIsLogggedin(false);
          setUserData(null);
          setWishList([]);
        }
      } catch (error) {
        setIsLogggedin(false);
        setUserData(null);
        setWishList([]);
      }
    };

    fetchLogin();
  }, []);

  const fetchUserWishlist = async () => {
    try {
      const res = await axios.get("/api/wishlist", {
        withCredentials: true,
      });

      if (res.data.success) {
        setWishList(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchUserWishlist();
    }
  }, [userData]);

  const addToWishList = async (item) => {
    if (!isLoggedin) {
      alert("Please login to add items to your wishlist");
      router.push("/login");
      return;
    }

    try {
      const data = {
        itemId: item.itemId,
        type: item.type,
        title: item.title,
        price: item.price,
        slug: item.slug,
        image: item.image,
        metadata: item.metadata,
      };

      const res = await axios.post("/api/wishlist", data, {
        withCredentials: true,
      });

      if (res.data.success) {
        setWishList((prev) => [res.data.data, ...prev]);
        alert("Added to wishlist");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const removeFromwishlist = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await axios.patch(
        "/api/wishlist",
        { id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setWishList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      alert("Failed to remove item");
      console.log(error);
    }
  };

  const clearWishlist = async () => {
    try {
      const res = await axios.delete("/api/wishlist", {
        withCredentials: true,
      });

      alert(res.data.message);
      setWishList([]);
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message || "Failed to clear wishlist"
      );
    }
  };

  const isInWishlist = (itemId) => {
    return wishlist.some((item) => item.itemId === itemId);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/user/logout', { withCredentials: true })
      alert(res.data.message)
      window.location.replace('/login')
    } catch (error) {
      console.log(error)
      alert('Failed to logout')
    }
  }

  const contextValues = {
    sidebar, setSidebar, isLoggedin, userData, removeFromwishlist, addToWishList, wishlist, clearWishlist, customServices, handleLogout, services
  }

  return (
    <Context.Provider value={contextValues}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider
