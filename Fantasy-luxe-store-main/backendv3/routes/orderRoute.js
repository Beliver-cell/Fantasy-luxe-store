import express from 'express'
import { placeOrderFlutterwave, updateStatus, allOrders, userOrders, verifyFlutterwave, cancelPendingOrder, continuePayment } from '../controllers/orderController.js'
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRouter = express.Router()

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

orderRouter.post('/flutterwave', authUser, placeOrderFlutterwave)

orderRouter.post('/userorders', authUser, userOrders)

orderRouter.post('/verifyFlutterwave', authUser, verifyFlutterwave)

orderRouter.post('/cancel-pending', authUser, cancelPendingOrder)

orderRouter.post('/continue-payment', authUser, continuePayment)

export default orderRouter;
