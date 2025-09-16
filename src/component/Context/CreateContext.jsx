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
        return prev.map((item) =>
          item.id === Number(id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const selectedItem = packages.find((item) => item.id === Number(id));
        if (selectedItem) {
          return [...prev, { ...selectedItem, quantity: 1 }];
        }
      }
      return prev;
    });
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
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export default CreateContextProvider;
