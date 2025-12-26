import jwt from 'jsonwebtoken'

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('WARNING: JWT_SECRET not configured!');
        return 'fallback-dev-secret-change-in-production';
    }
    return secret;
}

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Please login again." })
        }
        
        const decoded = jwt.verify(token, getJwtSecret());
        
        if (!decoded.id || decoded.role !== 'admin') {
            return res.json({ success: false, message: "Not Authorized. Admin access required." })
        }
        
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next()
    }
    catch (error) {
        console.error('Admin auth error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: "Session expired. Please login again." })
        }
        res.json({ success: false, message: "Invalid token. Please login again." })
    }
}

export default adminAuth