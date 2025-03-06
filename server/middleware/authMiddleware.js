const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    console.log('Received Token:', authHeader);  // Debugging Log

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No valid token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract only the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;

