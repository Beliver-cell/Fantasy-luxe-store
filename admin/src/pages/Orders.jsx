import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Shipping Modal State
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingData, setShippingData] = useState({
    orderId: null,
    trackingUrl: '',
    shippingId: '',
    carrier: ''
  });

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    
    if (newStatus === 'Shipped') {
      setShippingData({
        orderId,
        trackingUrl: '',
        shippingId: '',
        carrier: ''
      });
      setShowShippingModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Order status updated');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const submitShippingDetails = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { 
          orderId: shippingData.orderId, 
          status: 'Shipped',
          trackingUrl: shippingData.trackingUrl,
          shippingId: shippingData.shippingId,
          carrier: shippingData.carrier
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Order Shipped Successfully');
        setShowShippingModal(false);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "In Process") {
        return ['Order Placed', 'Packing', 'Shipped', 'Out for delivery'].includes(order.status);
    }
    return order.status === statusFilter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3>Order Page</h3>
        <select 
          className="border border-gray-300 rounded px-3 py-1"
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="All">All Orders</option>
          <option value="In Process">In Process</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      <div>
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-300 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
          >
            <img className="w-12" src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <div>
                {order.items.map((item, idx) => (
                  <p className="py-0.5" key={idx}>
                    {item.name} x {item.quantity}{' '}
                    <span>{item.size}</span>
                    {item.color && <span>, {item.color}</span>}
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + ' ' + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ','}</p>
                <p>
                  {order.address.city + ', ' + order.address.state + ', ' + order.address.country + ', ' + order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Total: {currency}{order.amount}
              </p>
              {order.deliveryFee !== undefined && (
                <p className="text-xs text-gray-500">
                  (Delivery: {order.deliveryFee === 0 ? 'FREE' : `${currency}${order.deliveryFee}`})
                </p>
              )}
            </div>
            <div>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              {order.trackingUrl && (
                  <div className="mt-2 text-xs text-gray-500 max-w-[150px] truncate">
                      <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">Track Order</a>
                  </div>
              )}
               {order.shippingId && (
                  <p className="text-xs text-gray-500 mt-1">ID: {order.shippingId}</p>
              )}
              {order.carrier && (
                  <p className="text-xs text-gray-500">Via: {order.carrier}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Enter Shipping Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Carrier Name</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  placeholder="e.g. DHL, FedEx, USPS"
                  value={shippingData.carrier}
                  onChange={(e) => setShippingData({...shippingData, carrier: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tracking Number / Shipping ID</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  placeholder="e.g. 1Z9999999999999999"
                  value={shippingData.shippingId}
                  onChange={(e) => setShippingData({...shippingData, shippingId: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tracking URL</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  placeholder="https://..."
                  value={shippingData.trackingUrl}
                  onChange={(e) => setShippingData({...shippingData, trackingUrl: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowShippingModal(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={submitShippingDetails}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Confirm Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
