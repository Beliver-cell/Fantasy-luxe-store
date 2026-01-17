import settingsModel from '../models/settingsModel.js';

// Get current settings
const getSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new settingsModel();
      await settings.save();
    }
    res.json({ success: true, settings });
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

    await settings.save();
    res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getSettings, updateSettings };