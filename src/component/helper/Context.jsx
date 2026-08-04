'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [dashboardSidebar, setDashboardSidebar] = useState(false);
  const [userSidebar, setUserSidebar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const isLoggedIn = !!userData;

  // Fetch regular user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/me', {
          validateStatus: (status) => status < 500
        });
        if (response.data?.success && response.data?.data) {
          setUserData(response.data.data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        setUserData(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch team member session
  useEffect(() => {
    const fetchTeamUser = async () => {
      try {
        const response = await axios.get('/api/team/me', {
          validateStatus: (status) => status < 500
        });
        if (response.data?.success && response.data?.data) {
          setTeamData(response.data.data);
        } else {
          setTeamData(null);
        }
      } catch (error) {
        setTeamData(null);
      }
    };
    fetchTeamUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post('/api/user/logout');
      setUserData(null);
      window.location.replace('/auth/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const teamLogout = async () => {
    try {
      await axios.post('/api/team/logout');
    } catch (error) {
      console.error("Team logout request failed:", error);
    } finally {
      setTeamData(null);
      window.location.replace('/team-auth/login');
    }
  };

  const contextValues = {
    sidebar, setSidebar,
    userSidebar, setUserSidebar,
    dashboardSidebar, setDashboardSidebar,
    userData, setUserData, teamData, setTeamData,
    isLoggedIn, logout, teamLogout
  };

  return (
    <Context.Provider value={contextValues}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
