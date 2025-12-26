import userModel from "../models/userModel.js";

// addToCart
const addToCart = async (req, res) => {
  try {
    const { userId,itemId, size } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        response: "Missing required fields: userId, itemId, or size.",
      });
    }
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        response: "User not found.",
      });
    }
    const cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({
      success: true,
      response: "Product added to cart.",
    });
  } catch (error) {
    res.json({
      success: false,
      response: error.message,
    });
  }
};

// getCartItems
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    res.json({
      success: true,
      response: cartData,
    });
  } catch (error) {
    res.json({
      success: false,
      response: error.message,
    });
  }
};

// updateCart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({
      success: true,
      response: "Product updated.",
    });
  } catch (error) {
    res.json({
      success: false,
      reponse: "Product update is failed !",
    });
  }
};

export { addToCart, getUserCart, updateCart };
