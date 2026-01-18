import settingsModel from '../models/settingsModel.js';
import ENV from '../config/serverConfig.js';

// Get current settings
const getSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new settingsModel({
        deliveryFee: ENV.DELIVERY_CHARGE,
        currency: ENV.CURRENCY
      });
      await settings.save();
    }
    
    // Ensure critical fields have values even if missing in old DB documents
    const settingsObj = settings.toObject();
    if (settingsObj.deliveryFee === undefined || settingsObj.deliveryFee === null) {
      settingsObj.deliveryFee = ENV.DELIVERY_CHARGE || 500;
    }
    
    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const { deliveryFee, currency, freeDeliveryEnabled, freeDeliveryThreshold } = req.body;

    let settings = await settingsModel.findOne();
    if (!settings) {
      settings = new settingsModel();
    }

    if (deliveryFee !== undefined) settings.deliveryFee = deliveryFee;
    if (currency !== undefined) settings.currency = currency;
    if (freeDeliveryEnabled !== undefined) settings.freeDeliveryEnabled = freeDeliveryEnabled;
    if (freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = freeDeliveryThreshold;

    if (req.body.deliveryInfo) {
      settings.deliveryInfo = {
        ...settings.deliveryInfo,
        ...req.body.deliveryInfo
      };
    }

    await settings.save();
    res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getSettings, updateSettings };