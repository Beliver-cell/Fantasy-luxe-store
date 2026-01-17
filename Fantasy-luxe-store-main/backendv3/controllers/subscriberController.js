import subscriberModel from "../models/subscriberModel.js";
import userModel from "../models/userModel.js";
import validator from 'validator';
import { sendSubscriptionConfirmation } from "../config/email.js";

const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingSubscriber = await subscriberModel.findOne({ email: normalizedEmail });
        
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({ success: false, message: "You're already subscribed to our newsletter" });
            } else {
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = new Date();
                await existingSubscriber.save();
                
                await sendSubscriptionConfirmation(normalizedEmail);
                
                return res.status(200).json({ success: true, message: "Welcome back! You've been re-subscribed to our newsletter" });
            }
        }

        const newSubscriber = new subscriberModel({
            email: normalizedEmail
        });

        await newSubscriber.save();

        const emailSent = await sendSubscriptionConfirmation(normalizedEmail);

        if (emailSent) {
            res.status(201).json({ 
                success: true, 
                message: "Thank you for subscribing! Check your email for a welcome message." 
            });
        } else {
            res.status(201).json({ 
                success: true, 
                message: "Thank you for subscribing to our newsletter!" 
            });
        }
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ success: false, message: "Unable to process subscription. Please try again later." });
    }
};

const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Valid email is required" });
        }

        const subscriber = await subscriberModel.findOne({ email: email.toLowerCase().trim() });

        if (!subscriber || !subscriber.isActive) {
            return res.status(404).json({ success: false, message: "Email not found in our subscription list" });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.status(200).json({ success: true, message: "You have been unsubscribed successfully" });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ success: false, message: "Unable to process request. Please try again later." });
    }
};

const getSubscribers = async (req, res) => {
    try {
        const subscribers = await subscriberModel.find({ isActive: true }).sort({ subscribedAt: -1 });
        const totalCount = await subscriberModel.countDocuments({ isActive: true });
        
        res.json({ 
            success: true, 
            subscribers,
            totalCount
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ success: false, message: "Unable to fetch subscribers" });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const totalSubscribers = await subscriberModel.countDocuments({ isActive: true });
        const totalUsers = await userModel.countDocuments({});
        
        const recentSubscribers = await subscriberModel.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .limit(10)
            .select('email subscribedAt');
        
        const recentUsers = await userModel.find({})
            .sort({ _id: -1 })
            .limit(10)
            .select('name email createdAt');
        
        res.json({ 
            success: true, 
            analytics: {
                totalSubscribers,
                totalUsers,
                recentSubscribers,
                recentUsers
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ success: false, message: "Unable to fetch analytics" });
    }
};

export { subscribe, unsubscribe, getSubscribers, getAnalytics };
