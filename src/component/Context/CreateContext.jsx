import React, { createContext, useState } from "react";
import { allpackages } from "../Asset/packageData";

export const CreateContext = createContext(null);



const CreateContextProvider = ({ children }) => {
  const [packages, setPackages] = useState(allpackages);
  const [sidebar, setSidebar] = useState(false);

  const [cartItem, setCartItem] = useState([]);

  const addToCart = (id) => {
    setCartItem((prev) => {
      const existing = prev.find((item) => item.id === Number(id));
      if (existing) {
        alert('Check cart');
        return prev;
      } else {
        const selectedItem = packages.find((item) => item.id === Number(id));
        if (selectedItem) {
          return [...prev, { ...selectedItem }];
        }
      }
      return prev;
    });
  };

const totalCartAmount = () => {
  return cartItem.reduce((total, item) => total + item.price, 0);
};


  return (
    <CreateContext.Provider
      value={{
        packages,
        setPackages,
        sidebar,
        setSidebar,
        cartItem,
        setCartItem,
        addToCart,
        totalCartAmount,

      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export default CreateContextProvider;
