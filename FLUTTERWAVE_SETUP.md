# Flutterwave Payment Integration

## Overview
Fantasy Luxe now uses **Flutterwave** as the exclusive payment gateway (replaced Paystack).

## API Endpoints Changed
- **Old**: `/api/order/paystack` → **New**: `/api/order/flutterwave`
- **Old**: `/api/order/verifyPaystack` → **New**: `/api/order/verifyFlutterwave`

## Environment Variables
Update your `.env` file with Flutterwave credentials:

```
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
```

## How to Get Flutterwave Keys
1. Sign up at https://flutterwave.com
2. Log in to your dashboard
3. Go to Settings → API Keys
4. Copy your Secret Key and Public Key
5. Add them to your `.env` file

## Payment Flow
1. User fills checkout form on `/place-order`
2. Frontend calls `/api/order/flutterwave` with order data
3. Backend creates Flutterwave payment link
4. User is redirected to Flutterwave payment page
5. After payment, user returns to `/verify?orderId=xxx&method=flutterwave&transaction_id=xxx`
6. Frontend verifies payment via `/api/order/verifyFlutterwave`
7. Order is confirmed and payment marked as complete

## Testing
- Use Flutterwave test credentials in development
- Use live credentials in production
- Test cards: https://developer.flutterwave.com/docs/integration-guides/testing

## Currency
- Default currency: NGN (Nigerian Naira)
- To change: Update `currency` variable in `backendv3/controllers/orderController.js`

## Webhook Setup (Optional)
For real-time payment verification:
1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/order/webhook`
3. Select events: Completed Charge
