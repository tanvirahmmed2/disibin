'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAndroid, FaCode, FaFigma } from "react-icons/fa";
import toast from "react-hot-toast";
import { FaCloud } from "react-icons/fa6";

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
  {
    id: 4,
    title: "System Automation",
    description: "Streamlining workflows through custom scripts, IoT integration, and cloud-based automated processes to enhance efficiency and reduce manual overhead.",
    icon: <FaCloud />,
  },
];

const customServices = [
  {
    id: 'e-commerce-management-platform',
    title: 'E-commerce Management Platform',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1777582922/ecommerce_gqkazm.png',
    description: "Our E-commerce Management Platform is a high-performance solution designed for businesses looking to scale their digital presence. It features a centralized hub for multi-channel inventory, synchronizing stock across your website, social media, and physical stores in real-time. We prioritize speed and scalability to ensure seamless performance during high-traffic sales seasons. Beyond transactions, advanced analytics provide deep insights into user behavior and conversion funnels. With secure payment integrations and automated order tracking, the platform ensures a frictionless customer journey. By automating administrative tasks like invoicing, we help you focus on brand growth and long-term customer loyalty.",
    features: [
      "Dynamic Multi-vendor & Storefront Support",
      "Real-time Inventory Synchronization Across Channels",
      "Advanced AI-Powered Product Search & Filtering",
      "Integrated Global Payment Gateways (Stripe, PayPal, SSLCommerz)",
      "Automated Order Processing & Invoice Generation",
      "Comprehensive Sales & Customer Behavior Analytics",
      "Mobile-Responsive Design & Native App Integration",
      "SEO Optimization & Automated Meta-Tagging",
      "Customizable Coupon & Loyalty Program Engine",
      "High-Security SSL Encryption & Fraud Detection"
    ]
  },
  {
    id: 'school-and-student-portal',
    title: 'School and Student Portal',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1777582920/school_management_dv8obj.png',
    description: "Our School and Student Portal is a comprehensive ERP designed to digitize the entire academic lifecycle. By centralizing enrollment, financial data, and academic records, we provide a single source of truth for modern educational institutions. Tailored interfaces for administrators, teachers, students, and parents foster a collaborative community through instant communication. Key features include automated fee collection, real-time attendance tracking, and digital gradebooks. The system also streamlines complex examination scheduling and automated result processing. Prioritizing data privacy with encrypted storage, this portal allows schools to modernize operations and focus on delivering high-quality instruction and fostering student growth.",
    features: [
      "Centralized Student Information System (SIS)",
      "Automated Fee Collection & Online Payment Portal",
      "Interactive Teacher, Student, & Parent Dashboards",
      "Real-time Attendance & Leave Management",
      "Digital Gradebook & Automated Report Card Generation",
      "Examination Scheduling & Result Management",
      "E-Learning Module for Course Material Sharing",
      "Library Management & Resource Tracking",
      "School Transport GPS Tracking & Management",
      "Internal Messaging & Urgent Broadcast System"
    ]
  },
  {
    id: 'parcel-receive-delivery-hub',
    title: 'Parcel Receive & Delivery Hub',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1777582922/delivery_lxgi2d.png',
    description: "Optimizing the last-mile journey, our Parcel Receive & Delivery Hub software synchronizes every stage of the shipment lifecycle. From initial pickup to final doorstep delivery, we provide a real-time tracking engine for total operational visibility. Utilizing advanced barcode and QR integration, we minimize human error and lost packages across multiple branches. The platform features intelligent route optimization to reduce fuel costs and significantly speed up delivery times. Hub managers can monitor staff performance and fleet health through a centralized dashboard. With automated billing and instant customer alerts, our solution builds the reliability and transparency essential for modern logistics.",
    features: [
      "Real-time Parcel Tracking & Status Updates",
      "Automated Barcode & QR Code Scanning System",
      "Intelligent Route Optimization for Couriers",
      "Multi-Branch Hub & Warehouse Management",
      "Courier Performance Tracking & Commissions",
      "Integrated Billing & Cash-on-Delivery (COD) Management",
      "Automated SMS & Email Customer Notifications",
      "Customer Self-Service Tracking Portal",
      "Digital Proof of Delivery (e-Signature/Photo)",
      "Comprehensive Logistics & Fleet Analytics"
    ]
  },
  {
    id: 'restaurant-business-track-management',
    title: 'Restaurant Business Track and Management',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1777582921/restaurant_kgjbfh.png',
    description: "Our Restaurant Management system harmonizes front-of-house hospitality with back-of-house operational precision. At its core is a fast POS system handling complex orders and various payment methods effortlessly. We provide recipe-level inventory tracking that updates in real-time, helping you identify waste and manage supplier costs effectively. A dedicated Kitchen Display System (KDS) replaces traditional paper tickets, ensuring chefs stay organized during peak hours. For diners, integrated table bookings and digital QR menus enhance the modern experience. The platform offers owners deep financial analytics and labor cost trends, allowing for data-driven menu engineering to maximize profitability across all locations.",
    features: [
      "Advanced POS with Offline Mode Capability",
      "Recipe-Level Inventory & Ingredient Tracking",
      "Kitchen Display System (KDS) for Order Precision",
      "Digital QR Menus & Online Ordering Integration",
      "Real-time Table Booking & Floor Management",
      "Employee Shift Scheduling & Payroll Management",
      "Comprehensive Daily Sales & Expense Analytics",
      "Supplier Management & Automated Purchase Orders",
      "Customer Loyalty & Discount Management",
      "Multi-Branch Centralized Management Dashboard"
    ]
  },
  {
    id: 'team-management-for-corporate-business',
    title: 'Team Management For Corporate Business',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1777582920/team_rliwkx.png',
    description: "Our Team Management Platform is an enterprise solution designed to align diverse teams with corporate objectives. Using interactive Kanban boards and Gantt charts, leadership can monitor organizational health while individual contributors focus on efficient task execution. The system integrates seamlessly with existing tools for document sharing and internal communication. Resource management features track bandwidth and project hours to prevent burnout and ensure realistic deadlines. Security is paramount, featuring granular permissions and audit logs to protect intellectual property. By emphasizing performance through OKR tracking and automated reporting, we help organizations execute complex projects with precision in today's competitive hybrid work environment.",
    features: [
      "Interactive Gantt Charts & Kanban Project Views",
      "Granular Role-Based Access Control (RBAC)",
      "Automated Time Tracking & Employee Timesheets",
      "Centralized Document Management & Versioning",
      "Integrated Internal Team Messaging & Video Calls",
      "Strategic Goal (OKR) & Performance Tracking",
      "Resource Allocation & Workload Balancing",
      "Customizable Workflow Automation & Triggers",
      "Comprehensive Project Financials & Budget Tracking",
      "Detailed Audit Logs & Enterprise-Grade Security"
    ]
  }
];

const faqs = [
  {
    id: 1,
    question: "What industries do you specialize in for web solutions?",
    answer: "We specialize in a diverse range of sectors including E-commerce, Education (School Management), Logistics (Parcel Hubs), Hospitality (Restaurants), and Corporate Team Management."
  },
  {
    id: 2,
    question: "Do you provide custom-built solutions or ready-made templates?",
    answer: "All our services are custom-built. While we have robust base architectures for things like ERPs and POS systems, we tailor the business logic, UI/UX, and features to meet your specific operational needs."
  },
  {
    id: 3,
    question: "Is your E-commerce platform scalable for high-traffic events?",
    answer: "Yes. We build our platforms using modern stacks like MERN or PERN with Next.js, ensuring high performance and the ability to scale resources during peak sales or promotional events."
  },
  {
    id: 4,
    question: "Can I integrate local payment gateways like SSLCommerz?",
    answer: "Absolutely. We support a wide range of payment integrations including SSLCommerz, Stripe, PayPal, and local mobile banking solutions (bKash, Nagad) depending on your region."
  },
  {
    id: 5,
    question: "Do your management systems work on mobile devices?",
    answer: "Yes, all our platforms are fully responsive. We also offer dedicated Android and iOS app development if your business requires a native mobile experience."
  },
  {
    id: 6,
    question: "How do you handle data security and privacy?",
    answer: "We implement enterprise-grade security, including SSL encryption, multi-factor authentication (MFA), role-based access control (RBAC), and regular automated backups to protect your data."
  },
  {
    id: 7,
    question: "Is training provided for my staff to use these systems?",
    answer: "Yes, we provide comprehensive onboarding sessions, video tutorials, and documentation to ensure your team is comfortable managing the new platform."
  },
  {
    id: 8,
    question: "Can your School Management system handle online exams?",
    answer: "Yes, our portal includes a module for examination management, featuring online testing, automated result processing, and digital report card generation."
  },
  {
    id: 9,
    question: "Does the Restaurant Management system support offline billing?",
    answer: "Our POS systems are designed with offline capability, allowing you to continue billing during internet outages and syncing data once the connection is restored."
  },
  {
    id: 10,
    question: "What kind of support do you offer after the project is launched?",
    answer: "We offer various maintenance packages that include 24/7 technical support, bug fixes, security updates, and feature enhancements as your business grows."
  },
  {
    id: 11,
    question: "Can I migrate my existing data from spreadsheets to your system?",
    answer: "Yes, we provide data migration services to help you transition your existing records (products, students, or customers) into our database without data loss."
  },
  {
    id: 12,
    question: "Is your Parcel Hub software capable of real-time tracking?",
    answer: "Yes, our logistics solution provides real-time GPS-based tracking and status updates via SMS and email for both operators and customers."
  },
  {
    id: 13,
    question: "Do you offer a subscription-based (SaaS) model?",
    answer: "We offer both one-time project-based ownership and monthly subscription models, giving you the flexibility to choose based on your budget."
  },
  {
    id: 14,
    question: "How long does it typically take to develop a custom platform?",
    answer: "A standard management system usually takes between 4 to 8 weeks, depending on the complexity of the features and the level of customization required."
  },
  {
    id: 15,
    question: "Can I manage multiple branches from a single dashboard?",
    answer: "Yes, all our management platforms are built with multi-branch support, allowing you to oversee various locations from a centralized admin panel."
  },
  {
    id: 16,
    question: "Is your Team Management software suitable for remote teams?",
    answer: "Definitely. It includes collaborative tools like Kanban boards, time tracking, and internal messaging specifically designed to improve remote team productivity."
  },
  {
    id: 17,
    question: "Can I request custom features after the system is live?",
    answer: "Yes, our modular architecture makes it easy to add new features or integrations at any time after the initial launch."
  },
  {
    id: 18,
    question: "What happens if there is a server-side error?",
    answer: "Our systems include automated error logging. Our technical team is notified immediately and works to resolve the issue before it impacts your operations."
  },
  {
    id: 19,
    question: "Does the E-commerce platform support SEO?",
    answer: "Yes, we build platforms with SEO best practices in mind, including server-side rendering, meta-tag management, and fast loading speeds."
  },
  {
    id: 20,
    question: "Can I customize the look and feel to match my brand?",
    answer: "Absolutely. We ensure the UI/UX design matches your brand identity, including colors, fonts, and overall layout style."
  }
];

const ContextProvider = ({ children }) => {
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const res = await axios.get("/api/user/islogin", {
          withCredentials: true,
        });

        if (res.data.success) {
          setIsLoggedIn(true);
          setUserData(res.data.data);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
          setWishlist([]);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserData(null);
        setWishlist([]);
      } finally {
        setIsLoadingAuth(false);
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
        setWishlist(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchUserWishlist();
    }
  }, [userData?.user_id]);

  const addToWishList = async (item) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to your wishlist");
      router.push("/login");
      return;
    }

    try {
      const data = {
        packageId: item.package_id
      };

      const res = await axios.post("/api/wishlist", data, {
        withCredentials: true,
      });

      if (res.data.success) {
        setWishlist((prev) => [res.data.data, ...prev]);
        toast.success("Added to wishlist");
        fetchUserWishlist(); // Refresh to get full item data (title, price etc)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await axios.delete(
        "/api/wishlist",
        { data: { id }, withCredentials: true }
      );

      if (res.data.success) {
        setWishlist((prev) => prev.filter((item) => item.wishlist_id !== id));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove item");
      console.log(error);
    }
  };

  const clearWishlist = async () => {
    try {
      const res = await axios.delete("/api/wishlist", {
        data: { clearAll: true },
        withCredentials: true,
      });

      toast.success(res.data.message);
      setWishlist([]);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to clear wishlist"
      );
    }
  };

  const isInWishlist = (package_id) => {
    return wishlist.some((item) => item.package_id === package_id);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/user/logout', { withCredentials: true })
      toast.success(res.data.message)
      window.location.replace('/login')
    } catch (error) {
      console.log(error)
      toast.error('Failed to logout')
    }
  }

  const contextValues = {
    sidebar, setSidebar, isLoggedIn, userData, isLoadingAuth, removeFromWishlist, addToWishList, wishlist, faqs, clearWishlist, customServices, handleLogout, services
  }

  return (
    <Context.Provider value={contextValues}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider
