'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Context = createContext()


const ContextProvider = ({ children }) => {
    const [sidebar, setSidebar] = useState(false)
    const [isLoggedin, setIsLogggedin] = useState(false)

    useEffect(()=>{
        const fetchLogin=async () => {
          try {
             const res=await axios.get('/api/user/islogin',{withCredentials:true})
             if(!res.data.success){
                setIsLogggedin(false)
             }
             setIsLogggedin(true)
          } catch (error) {
            setIsLogggedin(false)
          }
        }
        fetchLogin()
    },[])


    const contextValues = {
        sidebar, setSidebar,isLoggedin
    }

    return <Context.Provider value={contextValues}>
        {children}
    </Context.Provider>

}

export default ContextProvider