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
  const isLoggedIn = !!userData;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        const data = response.data;
        if (data.success && data.data) {
          setUserData(data.data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post('/api/user/logout');
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
