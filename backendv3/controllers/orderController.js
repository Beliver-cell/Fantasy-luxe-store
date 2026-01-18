import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import ENV from "../config/serverConfig.js";

const currency = ENV.CURRENCY;
const deliveryCharge = ENV.DELIVERY_CHARGE;

const placeOrderFlutterwave = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Validate required fields
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, items, amount, or address",
      });
    }

    if (!address.email || !address.firstName || !address.lastName) {
      return res.status(400).json({
        success: false,
        message: "Missing required address fields: email, firstName, or lastName",
      });
    }

    // Check if Flutterwave key is configured
    if (!ENV.FLUTTERWAVE_SECRET_KEY || ENV.FLUTTERWAVE_SECRET_KEY === 'demo') {
      console.error("Flutterwave secret key not configured");
      return res.status(500).json({
        success: false,
        message: "Payment service not configured. Please contact support.",
      });
    }

    // Check if user has an existing unpaid order
    const existingOrder = await orderModel.findOne({ userId, payment: false });
    if (existingOrder) {
      return res.json({
        success: false,
        message: "You have a pending order. Please complete or cancel it before placing a new one.",
      });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Flutterwave",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const frontendUrl = ENV.FRONTEND_URL.startsWith('http') ? ENV.FRONTEND_URL : `https://${ENV.FRONTEND_URL}`;

    const flutterwavePayload = {
      tx_ref: newOrder._id.toString(),
      amount: Number(amount),
      currency: currency,
      redirect_url: `${frontendUrl}/verify?orderId=${newOrder._id}&method=flutterwave`,
      customer: {
        email: address.email,
        name: `${address.firstName} ${address.lastName}`,
        phonenumber: address.phone || "",
      },
      customizations: {
        title: "Fantasy Luxe Payment",
        logo: ENV.SITE_LOGO_URL,
      },
    };

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      flutterwavePayload,
      {
        headers: {
          Authorization: `Bearer ${ENV.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      res.json({
        success: true,
        link: response.data.data.link,
      });
    } else {
      await orderModel.findByIdAndDelete(newOrder._id);
      res.json({
        success: false,
        message: response.data.message || "Failed to create Flutterwave payment",
      });
    }
  } catch (error) {
    console.error("Flutterwave payment error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Payment initialization failed",
    });
  }
};

const continuePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.body.userId || req.userId;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (order.payment) {
      return res.json({ success: false, message: "This order has already been paid" });
    }

    if (!ENV.FLUTTERWAVE_SECRET_KEY || ENV.FLUTTERWAVE_SECRET_KEY === 'demo') {
      return res.status(500).json({ success: false, message: "Payment service not configured" });
    }

    const frontendUrl = ENV.FRONTEND_URL.startsWith('http') ? ENV.FRONTEND_URL : `https://${ENV.FRONTEND_URL}`;

    const flutterwavePayload = {
      tx_ref: order._id.toString(),
      amount: Number(order.amount),
      currency: currency,
      redirect_url: `${frontendUrl}/verify?orderId=${order._id}&method=flutterwave`,
      customer: {
        email: order.address.email,
        name: `${order.address.firstName} ${order.address.lastName}`,
        phonenumber: order.address.phone || "",
      },
      customizations: {
        title: "Fantasy Luxe Payment",
        logo: ENV.SITE_LOGO_URL,
      },
    };

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      flutterwavePayload,
      {
        headers: {
          Authorization: `Bearer ${ENV.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      res.json({
        success: true,
        link: response.data.data.link,
      });
    } else {
      res.json({
        success: false,
        message: response.data.message || "Failed to create payment link",
      });
    }
  } catch (error) {
    console.error("Continue payment error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Failed to continue payment",
    });
  }
};

const verifyFlutterwave = async (req, res) => {
  const { transaction_id, orderId } = req.body;
  const userId = req.body.userId || req.userId;

  try {
    // 1. Verify transaction with Flutterwave API
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${ENV.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const flwData = response.data.data;

    if (response.data.status === "success" && flwData.status === "successful") {
      // 2. Fetch the actual order from our database
      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      // 3. SECURITY: Verify the order belongs to the user requesting verification
      if (order.userId.toString() !== userId.toString()) {
        console.error(`[SECURITY ALERT] Verification attempt for order ${orderId} by unauthorized user ${userId}`);
        return res.json({ success: false, message: "Unauthorized order verification" });
      }

      // 4. SECURITY: Verify the amount and currency match the order precisely
      const paidAmount = Number(flwData.amount);
      const expectedAmount = Number(order.amount); // Ensure amount in DB matches what was sent to FLW

      if (isNaN(paidAmount) || isNaN(expectedAmount) || paidAmount < expectedAmount || flwData.currency !== currency) {
        console.error(`[SECURITY ALERT] Amount mismatch for order ${orderId}. Expected ${expectedAmount} ${currency}, got ${paidAmount} ${flwData.currency}`);
        return res.json({ success: false, message: "Payment amount mismatch detected" });
      }

      // 5. SECURITY: Verify tx_ref matches our orderId
      if (flwData.tx_ref !== orderId.toString()) {
        return res.json({ success: false, message: "Transaction reference mismatch" });
      }

      // 6. Finalize order - mark as paid and change status to Order Placed
      await orderModel.findByIdAndUpdate(orderId, { 
        payment: true, 
        status: 'Order Placed',
        flutterwaveRef: transaction_id 
      });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const cancelPendingOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.body.userId || req.userId;
    
    let pendingOrder;
    
    if (orderId) {
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }
      if (order.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      if (order.payment) {
        return res.json({ success: false, message: "Cannot cancel a paid order" });
      }
      pendingOrder = await orderModel.findByIdAndDelete(orderId);
    } else {
      pendingOrder = await orderModel.findOneAndDelete({ userId, payment: false });
    }
    
    if (pendingOrder) {
      res.json({ success: true, message: "Order cancelled successfully" });
    } else {
      res.json({ success: true, message: "No pending order found" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrderFlutterwave,
  allOrders,
  updateStatus,
  userOrders,
  verifyFlutterwave,
  cancelPendingOrder,
  continuePayment,
};
