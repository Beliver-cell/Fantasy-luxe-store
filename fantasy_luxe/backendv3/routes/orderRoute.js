import express from 'express'
import { placeOrder, placeOrderFlutterwave, updateStatus, allOrders, userOrders, verifyFlutterwave } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/flutterwave', authUser, placeOrderFlutterwave)

orderRouter.post('/userorders', authUser, userOrders)

orderRouter.post('/verifyFlutterwave', authUser, verifyFlutterwave)

export default orderRouter;
