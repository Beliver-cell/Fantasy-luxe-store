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
      settingsObj.deliveryFee = ENV.DELIVERY_CHARGE || 0;
    }
    // Ensure regions array exists for older documents
    if (!Array.isArray(settingsObj.regions)) settingsObj.regions = [];
    // Ensure keepAliveUrl exists
    if (!settingsObj.keepAliveUrl) settingsObj.keepAliveUrl = ENV.KEEP_ALIVE_URL || 'https://fantasyluxe.store/health';
    
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

    // Allow updating regions from admin UI
    if (Array.isArray(req.body.regions)) {
      // Normalize entries: keep required fields only
      settings.regions = req.body.regions.map(r => ({
        state: (r.state || '').trim(),
        fee: Number(r.fee || 0),
        active: r.active === undefined ? true : Boolean(r.active)
      }));
    }
    if (req.body.keepAliveUrl !== undefined) {
      settings.keepAliveUrl = String(req.body.keepAliveUrl || '').trim();
    }

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