import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  deliveryFee: {
    type: Number,
    default: 500,
    min: 0
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  freeDeliveryEnabled: {
    type: Boolean,
    default: false
  },
  freeDeliveryThreshold: {
    type: Number,
    default: 10000,
    min: 0
  }
}, {
  timestamps: true
});

const settingsModel = mongoose.models.settings || mongoose.model('settings', settingsSchema);

export default settingsModel;