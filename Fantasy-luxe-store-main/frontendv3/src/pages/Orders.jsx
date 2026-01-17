import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import EmptyState from "../components/EmptyState";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleContinuePayment = async (orderId) => {
    setProcessingPayment(orderId);
    try {
      const response = await axios.post(
        backendUrl + "/api/order/continue-payment",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.info("Redirecting to payment...");
        window.location.replace(response.data.link);
      } else {
        toast.error(response.data.message || "Failed to continue payment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to continue payment");
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const response = await axios.post(
        backendUrl + "/api/order/cancel-pending",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order cancelled");
        loadOrderData();
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (!token) {
    return (
      <div className="border-t pt-16">
        <div className="text-2xl">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <EmptyState
          icon="order"
          title="Please log in"
          message="Sign in to view your order history and track your purchases"
          buttonText="Login"
          onButtonClick={() => navigate("/login")}
          showRecommendations={false}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border-t pt-16">
        <div className="text-2xl">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status, payment) => {
    if (!payment) return 'bg-orange-500';
    if (status === 'Delivered') return 'bg-green-500';
    if (status === 'Shipped') return 'bg-blue-500';
    if (status === 'Cancelled') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getStatusText = (status, payment) => {
    if (!payment) return 'Pending Payment';
    return status;
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="order"
          title="No orders yet"
          message="Looks like you haven't placed any orders. Start shopping and your orders will appear here!"
          buttonText="Browse Collection"
          recommendationTitle="Discover our bestsellers"
        />
      ) : (
        <div className="">
          {orders.map((order, index) => (
            <div
              className="py-4 border-t border-gray-200 border-b"
              key={order._id || index}
            >
              {!order.payment && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <p className="text-orange-800 text-sm font-medium mb-2">
                    Payment pending - Complete your payment to confirm this order
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleContinuePayment(order._id)}
                      disabled={processingPayment === order._id}
                      className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 disabled:bg-orange-400"
                    >
                      {processingPayment === order._id ? "Processing..." : "Continue Payment"}
                    </button>
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-50"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className={`min-w-2 h-2 rounded-full ${getStatusColor(order.status, order.payment)}`}></p>
                  <p className="text-sm font-medium">{getStatusText(order.status, order.payment)}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p>Order Total: <span className="font-medium text-black">{currency}{order.amount}</span></p>
                <p>Payment: {order.paymentMethod}</p>
              </div>

              {order.items.map((item, itemIndex) => (
                <div
                  className="flex items-start gap-4 py-2 text-gray-700"
                  key={itemIndex}
                >
                  <img 
                    className="w-16 sm:w-20 object-cover" 
                    src={item.images?.[0] || item.image} 
                    alt={item.name}
                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <p>{currency}{item.price}</p>
                      <p>Qty: {item.quantity}</p>
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {order.payment && (
                <div className="mt-3 text-right">
                  <button onClick={loadOrderData} className="border border-gray-200 px-4 py-2 text-sm font-medium rounded-sm cursor-pointer hover:bg-gray-50">
                    Track Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
