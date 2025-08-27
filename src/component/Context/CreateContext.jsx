import React, { createContext, useState } from "react";
import packages from "../Asset/packages";

export const CreateContext = createContext(null);

// Initialize cart: nested by category -> package id
const getDefaultPackage = () => {
  const cart = {};
  packages.forEach(cat => {
    cat.packages.forEach(pack => {
      cart[pack.id] = 0;
    });
  });
  return cart;
};

const CreateContextProvider = ({ children }) => {
  const [packageItems, setPackageItems] = useState(getDefaultPackage());

  const addToCart = (id) => {
    setPackageItems(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const removeFromCart = (id) => {
    setPackageItems(prev => ({ ...prev, [id]: Math.max(prev[id] - 1, 0) }));
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in packageItems) {
      if (packageItems[id] > 0) {
        // Find package in nested structure
        for (const cat of packages) {
          const item = cat.packages.find(p => p.id === Number(id));
          if (item) {
            total += item.price * packageItems[id];
            break;
          }
        }
      }
    }
    return total;
  };

  const getTotalItems = () => {
    return Object.values(packageItems).reduce((sum, val) => sum + val, 0);
  };

  return (
    <CreateContext.Provider
      value={{
         packages,
        packageItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalItems
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export default CreateContextProvider;
