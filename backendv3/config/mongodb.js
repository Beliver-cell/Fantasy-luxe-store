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
        console.error('MONGODB_URI is not defined - Database connection will fail');
        // Do not throw here if we want to allow server startup without DB (e.g. for health checks)
        // throw new Error('MONGODB_URI is not defined in the configuration');
        return;
    }
    
    try {
        await mongoose.connect(mongoUri);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
}

export default connectDB;