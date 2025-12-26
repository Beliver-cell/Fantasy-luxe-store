import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized! Please login again."
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET || process.env.jwtSecret);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({
      success: false,
      message: message
    });
  }
};

export default authUser;
