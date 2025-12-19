import React, { createContext, useState, useEffect, useContext } from "react";
import { getAllCars } from "../services/carService";
import { NotificationContext } from "./NotificationContext";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useContext(NotificationContext);

  // Fetch cars from backend on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const cars = await getAllCars();

        // Transform backend car data to match frontend structure
        const transformedCars = cars.map((car) => ({
          id: car._id,
          name: `${car.manufactureYear} ${car.brand} ${car.model}`,
          category: car.condition,
          image: car.images && car.images.length > 0 ? car.images[0] : null,
          new_price: car.price,
          // Keep all original backend fields
          ...car
        }));

        setAllProducts(transformedCars);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setError(err.message);
        notify("Failed to load products from server.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [notify]);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 0) {
        newCart[itemId] -= 1;
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = allProducts.find((product) => product.id === item);
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const cars = await getAllCars();
      const transformedCars = cars.map((car) => ({
        id: car._id,
        name: `${car.manufactureYear} ${car.brand} ${car.model}`,
        category: car.condition,
        image: car.images && car.images.length > 0 ? car.images[0] : null,
        new_price: car.price,
        ...car
      }));
      setAllProducts(transformedCars);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh cars:", err);
      setError(err.message);
      notify("Failed to refresh products.", "error");
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    all_product: allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartItems,
    getTotalCartAmount,
    loading,
    error,
    refreshProducts
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
