import mongoose from 'mongoose'

const connectDB = async() => {
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB connected successfully');
    })
    
    mongoose.connection.on('error', (err)=>{
        console.error('MongoDB connection error:', err.message);
    })
    
    const mongoUri = process.env.MONGODB_URI || process.env.mongodb_URI;
    
    if (!mongoUri) {
        console.log('WARNING: MONGODB_URI not configured - database features will not work');
        return;
    }
    
    try {
        await mongoose.connect(mongoUri);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
}

export default connectDB;