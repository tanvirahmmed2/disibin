'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Context = createContext()


const ContextProvider = ({ children }) => {
    const [sidebar, setSidebar] = useState(false)
    const [isLoggedin, setIsLogggedin] = useState(false)
    const [userData, setUserData]= useState([])


    useEffect(()=>{
        const fetchLogin=async () => {
          try {
             const res=await axios.get('/api/user/islogin',{withCredentials:true})
             if(!res.data.success){
                setIsLogggedin(false)
             }
             console.log(res)
             setIsLogggedin(true)
             setUserData(res.data.payload)
          } catch (error) {
            setIsLogggedin(false)
            setUserData([])
          }
        }
        fetchLogin()
    },[])


    const contextValues = {
        sidebar, setSidebar,isLoggedin,userData
    }

    return <Context.Provider value={contextValues}>
        {children}
    </Context.Provider>

}

export default ContextProvider