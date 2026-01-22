import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import settingsModel from "../models/settingsModel.js";
import productModel from "../models/productModel.js";
import axios from "axios";
import ENV from "../config/serverConfig.js";
import { sendOrderPlacedEmail, sendPaymentSuccessEmail, sendOrderShippedEmail, sendOrderDeliveredEmail } from "../config/email.js";

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

    // Validate stock for all items
    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.name || item._id}`,
        });
      }
      // Only check stock if product has limited stock (not null/undefined)
      if (product.stock !== null && product.stock !== undefined) {
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
          });
        }
      }
    }

    // Get delivery fee from request (calculated on frontend) or default to 0
    const deliveryFee = req.body.deliveryFee !== undefined ? Number(req.body.deliveryFee) : 0;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Flutterwave",
      payment: false,
      deliveryFee,
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
      // Fetch current settings for dynamic delivery info in email
      const settings = await settingsModel.findOne();
      
      // Send Order Placed Email (Pending Payment)
      await sendOrderPlacedEmail(
        address.email, 
        newOrder._id, 
        amount, 
        response.data.data.link,
        settings?.deliveryInfo
      );

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
      // Send Order Placed Email (Pending Payment)
      await sendOrderPlacedEmail(
        address.email, 
        newOrder._id, 
        amount, 
        response.data.data.link
      );

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

      // 7. Reduce stock for each item (atomic operation for concurrency safety)
      for (const item of order.items) {
        const product = await productModel.findById(item._id);
        if (product && product.stock !== null && product.stock !== undefined) {
          // Use atomic $inc to prevent race conditions
          await productModel.findByIdAndUpdate(item._id, {
            $inc: { stock: -item.quantity }
          });
        }
      }

      // Send Payment Success Email
      const email = order.address.email || (await userModel.findById(userId)).email;
      const settings = await settingsModel.findOne();
      await sendPaymentSuccessEmail(email, orderId, paidAmount, settings?.deliveryInfo);

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
    const { orderId, status, trackingUrl, shippingId, carrier } = req.body;
    
    // Create update object
    const updateData = { status };
    if (trackingUrl) updateData.trackingUrl = trackingUrl;
    if (shippingId) updateData.shippingId = shippingId;
    if (carrier) updateData.carrier = carrier;

    const order = await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
    
    if (order) {
        const user = await userModel.findById(order.userId);
        const email = order.address?.email || user?.email;
        
        if (email) {
            if (status === 'Shipped') {
                await sendOrderShippedEmail(
                    email, 
                    orderId, 
                    trackingUrl || order.trackingUrl,
                    shippingId || order.shippingId,
                    carrier || order.carrier
                );
            } else if (status === 'Delivered') {
                await sendOrderDeliveredEmail(email, orderId);
            }
        }
    }

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

const dashboardData = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    
    const totalEarnings = orders.reduce((acc, order) => {
      // Only count earnings for orders that are paid
      return order.payment ? acc + order.amount : acc;
    }, 0);

    const totalOrders = orders.length;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const latestOrders = orders.reverse().slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalEarnings,
        totalOrders,
        statusCounts,
        latestOrders
      }
    });
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
  dashboardData,
};
