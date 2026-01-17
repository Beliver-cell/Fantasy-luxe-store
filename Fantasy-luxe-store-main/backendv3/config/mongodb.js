import mongoose from 'mongoose'
import ENV from './serverConfig.js'

const connectDB = async() => {
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB connected successfully');
    })
    
    mongoose.connection.on('error', (err)=>{
        console.error('MongoDB connection error:', err.message);
    })
    
    const mongoUri = ENV.MONGODB_URI;
    
    if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in the configuration');
    }
    
    try {
        await mongoose.connect(mongoUri);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
}

export default connectDB;