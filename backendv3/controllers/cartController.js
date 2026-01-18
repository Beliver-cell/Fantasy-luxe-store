import userModel from "../models/userModel.js";

// addToCart
// addToCart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, color } = req.body;

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
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        if (cartData[itemId][size][color]) {
          cartData[itemId][size][color] += 1;
        } else {
          cartData[itemId][size][color] = 1;
        }
      } else {
        cartData[itemId][size] = {};
        cartData[itemId][size][color] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = {};
      cartData[itemId][size][color] = 1;
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
// updateCart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, color, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size][color] = quantity;

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
