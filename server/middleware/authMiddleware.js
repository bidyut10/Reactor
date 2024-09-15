const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const secret = "secret"; // Use environment variables in production

// Middleware for JWT Authentication
const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        req.userId = decoded.userId; // Attach userId to request object
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

// Middleware for Authorization (Owner Check)
const authorizeProjectOwnership = async (req, res, next) => {
    const projectId = req.params.projectId;
    const project = await projectModel.findById(projectId);

    if (!project) {
        return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.createdBy.toString() !== req.userId) {
        return res.status(403).json({ success: false, message: "Unauthorized action. You do not own this project." });
    }

    next(); // Proceed if ownership is valid
};

module.exports = { authenticateToken, authorizeProjectOwnership };
