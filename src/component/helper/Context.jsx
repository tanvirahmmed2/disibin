'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export const Context = createContext()



const ContextProvider = ({ children }) => {
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false);
  const [dashboardSidebar, setDashboardSidebar] = useState(false);
  const [userSidebar, setUserSidebar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.success && data.data) {
          setUserData(data.data);
          setIsLoggedIn(true);
        } else {
          setUserData(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userData]);

  const logout = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST' });
      setUserData(null);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValues = {
    sidebar, setSidebar,
    userSidebar, setUserSidebar,
    dashboardSidebar, setDashboardSidebar,
    userData, setUserData,
    isLoggedIn, logout
  }

  return (
    <Context.Provider value={contextValues}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider
