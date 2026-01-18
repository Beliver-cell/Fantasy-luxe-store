import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config/api";

//creating context
export const ShopContext = createContext();

//creating context-provider
export const ShopContextProvider = ({ children }) => {
  const currency = "₦";
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(false);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(10000);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProductData] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const backendUrl = BACKEND_URL;

  const addToCart = async (itemId, size, color) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    const mycartData = structuredClone(cartItems || {});

    if (mycartData[itemId]) {
      if (mycartData[itemId][size]) {
        if (mycartData[itemId][size][color]) {
          mycartData[itemId][size][color] += 1;
        } else {
          mycartData[itemId][size][color] = 1;
        }
      } else {
        mycartData[itemId][size] = {};
        mycartData[itemId][size][color] = 1;
      }
    } else {
      mycartData[itemId] = {};
      mycartData[itemId][size] = {};
      mycartData[itemId][size][color] = 1;
    }

    if (!itemId) {
      return;
    }

    setCartItems(mycartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, color },
          { headers: { token } }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getcartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        for (const itemColor in cartItems[items][item]) {
          try {
            if (cartItems[items][item][itemColor] > 0) {
              totalCount += cartItems[items][item][itemColor];
            }
          } catch (err) {
            // Cart calculation error
          }
        }
      }
    }

    return totalCount;
  };

  const updateQuantity = async (itemId, size, color, quantity) => {
    const mycartData = structuredClone(cartItems);
    mycartData[itemId][size][color] = quantity;

    setCartItems(mycartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          {
            itemId,
            size,
            color,
            quantity,
          },
          { headers: { token } }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getEffectiveDeliveryFee = () => {
    if (!freeDeliveryEnabled) return deliveryFee;
    const subtotal = totalcartAmount();
    return subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
  };

  const totalcartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      let itemInfo = products.find((products) => products._id === items);
      
      if (!itemInfo) continue; // Skip if product not found

      for (const item in cartItems[items]) {
         for (const itemColor in cartItems[items][item]) {
          try {
             if (cartItems[items][item][itemColor] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item][itemColor];
            }
          } catch (err) {
            // Calculation error
          }
        }
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProductData(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems(response.data.response);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSettings = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/settings/get");
      if (response.data.success) {
        const settingsDeliveryFee = response.data.settings.deliveryFee;
        // If undefined or null, default to 0. If it is 0, it stays 0.
        setDeliveryFee(settingsDeliveryFee !== undefined && settingsDeliveryFee !== null ? settingsDeliveryFee : 0);
        setFreeDeliveryEnabled(response.data.settings.freeDeliveryEnabled || false);
        setFreeDeliveryThreshold(response.data.settings.freeDeliveryThreshold);
      }
    } catch (error) {
      // Use default delivery fee if settings can't be fetched
    }
  };

  useEffect(() => {
    getProductsData();
    getSettings();
  }, []);


  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  },[]);

  const value = {
    products,
    deliveryFee,
    freeDeliveryEnabled,
    freeDeliveryThreshold,
    getEffectiveDeliveryFee,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getcartCount,
    updateQuantity,
    totalcartAmount,
    navigate,
    token,
    setToken,
    backendUrl,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
