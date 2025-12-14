import {v2 as cloudinary} from 'cloudinary'

const connectCloudinary = async () => {
    try {
        if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'your_cloudinary_name') {
            return;
        }
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
        })
    } catch (error) {
        // Cloudinary configuration failed
    }
}

export default connectCloudinary;