import { v2 as cloudinary } from 'cloudinary'
import ENV from './serverConfig.js'

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: ENV.CLOUDINARY_NAME,
            api_key: ENV.CLOUDINARY_API_KEY,
            api_secret: ENV.CLOUDINARY_API_SECRET,
        })
    } catch (error) {
        console.error('Cloudinary configuration failed:', error.message);
    }
}

export default connectCloudinary;