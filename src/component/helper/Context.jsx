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
    const savedUser = localStorage.getItem('disibin_user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('disibin_user', JSON.stringify(userData));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('disibin_user');
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
