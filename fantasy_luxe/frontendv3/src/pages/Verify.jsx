import React from "react";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const verifyPayment = async () => {
    try {
      if (!token) {
        setTimeout(() => navigate("/login"), 2000);
        return null;
      }

      if (!orderId) {
        setTimeout(() => navigate("/cart"), 2000);
        return null;
      }

      let response;

      if (method === "flutterwave") {
        const transactionId = searchParams.get("transaction_id");
        if (!transactionId) {
          toast.error("Payment reference not found. Please try again.");
          setTimeout(() => navigate("/cart"), 2000);
          return;
        }

        response = await axios.post(
          backendUrl + "/api/order/verifyFlutterwave",
          { transaction_id: transactionId, orderId, userId: token },
          { headers: { token } }
        );

        if (response.data.success) {
          setCartItems({});
          toast.success("✓ Payment successful! Thank you for your order.");
          setTimeout(() => navigate("/orders"), 2000);
        } else {
          toast.error(response.data.message || "Payment verification failed. Your order has been cancelled.");
          setTimeout(() => navigate("/cart"), 2000);
        }
      } else {
        toast.error("Invalid payment method");
        setTimeout(() => navigate("/cart"), 2000);
      }
    } catch (error) {
      toast.error(error.message || "Verification error. Please contact support.");
      setTimeout(() => navigate("/cart"), 3000);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center py-8">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black mx-auto mb-6"></div>
            <p className="text-2xl font-semibold text-gray-800">Verifying Your Payment</p>
            <p className="text-sm text-gray-500 mt-3">We're confirming your Flutterwave transaction...</p>
            <p className="text-xs text-gray-400 mt-2">This usually takes less than 10 seconds</p>
          </>
        ) : (
          <div>
            <p className="text-lg text-gray-600">Redirecting you...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait a moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
