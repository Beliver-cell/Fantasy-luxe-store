import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/Shopcontext";
import { toast } from "react-toastify";
import axios from "axios";

const Placeorder = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasPendingOrder, setHasPendingOrder] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    totalcartAmount,
    deliveryFee,
    getEffectiveDeliveryFee,
    products,
  } = useContext(ShopContext);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      try {
        const response = await axios.get(backendUrl + "/api/user/profile", { headers: { token } });
        if (response.data.success && response.data.user) {
          const user = response.data.user;
          const nameParts = (user.name || "").split(" ");
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email || "",
            street: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            zipCode: user.address?.zipCode || "",
            country: user.address?.country || "",
            phone: user.phone || "",
          }));
        }
      } catch (error) {
        console.error("Failed to load profile for auto-fill:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadUserProfile();
  }, [token, backendUrl]);

  const onchangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleCancelPendingOrder = async () => {
    setCancellingOrder(true);
    try {
      const response = await axios.post(backendUrl + "/api/order/cancel-pending", {}, { headers: { token } });
      if (response.data.success) {
        toast.success("Previous order cancelled. You can now proceed.");
        setHasPendingOrder(false);
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrder(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions

    setLoading(true);
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          for (const itemColor in cartItems[items][item]) {
            if (cartItems[items][item][itemColor] > 0) {
              const itemInfo = structuredClone(
                products.find((product) => product._id === items)
              );

              if (itemInfo) {
                itemInfo.size = item;
                itemInfo.color = itemColor;
                itemInfo.quantity = cartItems[items][item][itemColor];
                orderItems.push(itemInfo);
              }
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: (totalcartAmount() + getEffectiveDeliveryFee()), // Flutterwave expects major unit (Naira) for NGN
      };

      const responseFlutterwave = await axios.post(backendUrl + '/api/order/flutterwave', orderData, { headers: { token } });

      if (responseFlutterwave.data.success) {
        toast.info("Securely redirecting to Flutterwave...");
        const { link } = responseFlutterwave.data;
        window.location.replace(link);
      } else {
        if (responseFlutterwave.data.message?.includes("pending order")) {
          setHasPendingOrder(true);
        }
        toast.error(responseFlutterwave.data.message || "Payment initialization failed");
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Payment failed. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* --------Left side ----- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onchangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
            type="text"
            placeholder="Your First Name"
          />
          <input
            required
            onChange={onchangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
            type="text"
            placeholder="Your Last Name"
          />
        </div>
        <input
          required
          onChange={onchangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          type="email"
          placeholder="Your Email Address"
        />
        <input
          required
          onChange={onchangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          type="text"
          placeholder="Street Address"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onchangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
            type="text"
            placeholder="Your City"
          />
          <input
            required
            onChange={onchangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
            type="text"
            placeholder="Your State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onchangeHandler}
            name="zipCode"
            value={formData.zipCode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
            type="number"
            placeholder="ZIP / Postal Code"
          />
          <input
            required
            onChange={onchangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
            type="text"
            placeholder="Your Country"
          />
        </div>

        <input
          required
          onChange={onchangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          type="number"
          placeholder="Contact Number"
        />
      </div>

      {/* -------Right side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          {hasPendingOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm mb-3">
                You have a pending unpaid order. Cancel it to place a new order.
              </p>
              <button
                type="button"
                onClick={handleCancelPendingOrder}
                disabled={cancellingOrder}
                className="bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700 disabled:bg-amber-400"
              >
                {cancellingOrder ? "Cancelling..." : "Cancel Previous Order"}
              </button>
            </div>
          )}
          <div className="w-full text-end mt-8">
            <button
              className="bg-black text-white px-16 py-3 text-sm cursor-pointer hover:bg-gray-800 transition-all disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-3 ml-auto min-w-[200px]"
              type="submit"
              disabled={loading || hasPendingOrder}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>SECURELY REDIRECTING...</span>
                </>
              ) : (
                "PAY NOW"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Placeorder;
