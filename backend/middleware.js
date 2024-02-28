const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    authMiddleware
};
