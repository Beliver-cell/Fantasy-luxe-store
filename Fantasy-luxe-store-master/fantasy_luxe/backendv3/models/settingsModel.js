import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  deliveryFee: {
    type: Number,
    default: 500, // Default delivery fee in Naira (₦500)
    min: 0
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  freeDeliveryThreshold: {
    type: Number,
    default: 10000, // Free delivery above ₦10,000
    min: 0
  }
}, {
  timestamps: true
});

const settingsModel = mongoose.models.settings || mongoose.model('settings', settingsSchema);

export default settingsModel;