import express from 'express';
import { subscribe, unsubscribe, getSubscribers, getAnalytics } from '../controllers/subscriberController.js';
import adminAuth from '../middleware/adminAuth.js';

const subscriberRouter = express.Router();

subscriberRouter.post('/subscribe', subscribe);
subscriberRouter.post('/unsubscribe', unsubscribe);
subscriberRouter.get('/list', adminAuth, getSubscribers);
subscriberRouter.get('/analytics', adminAuth, getAnalytics);

export default subscriberRouter;
