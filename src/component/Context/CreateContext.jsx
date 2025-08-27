import React, { createContext, useState } from "react";
import packages from "../Asset/packages";

export const CreateContext = createContext(null);

const getDefaultPackage = () => {
  const cart = {};
  packages.forEach(pkg => {
    cart[pkg.id] = 0;
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
        const item = packages.find(p => p.id === Number(id));
        if (item) {
          total += item.price * packageItems[id];
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
