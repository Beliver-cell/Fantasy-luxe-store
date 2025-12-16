import express from 'express'
import { placeOrder, placeOrderFlutterwave, updateStatus, allOrders, userOrders, verifyFlutterwave } from '../controllers/orderController.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin auth removed: allow listing/updating orders without login
orderRouter.post('/list', allOrders)
orderRouter.post('/status', updateStatus)

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/flutterwave', authUser, placeOrderFlutterwave)

orderRouter.post('/userorders', authUser, userOrders)

orderRouter.post('/verifyFlutterwave', authUser, verifyFlutterwave)

export default orderRouter;
