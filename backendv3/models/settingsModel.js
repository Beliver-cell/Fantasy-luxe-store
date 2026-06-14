import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  // Region-specific delivery fees. Example: { state: 'Lagos', fee: 1500, active: true }
  regions: {
    type: [
      {
        state: { type: String, required: true },
        fee: { type: Number, default: 0, min: 0 },
        active: { type: Boolean, default: true }
      }
    ],
    default: []
  },
  // Optional keep-alive URL that the server can use for wake-up pings.
  keepAliveUrl: {
    type: String,
    default: 'https://fantasyluxe.store/health'
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
  },
  deliveryInfo: {
    dispatchDays: { type: String, default: "WEDNESDAYS and SATURDAYS" },
    deliveryTime: { type: String, default: "1-3 working days" },
    outsideDispatchPolicy: { type: String, default: "Orders placed outside these days will be shipped on the next scheduled dispatch day" }
  }
}, {
  timestamps: true
});

const settingsModel = mongoose.models.settings || mongoose.model('settings', settingsSchema);

export default settingsModel;