const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const secret = "secret"; // Use environment variables in production

// Sign Up User
const signUpUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Generate username from email or other logic
        const username = email.split('@')[0];

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            email,
            username,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: "1h" });

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Error in signUpUser:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports = { signUpUser, loginUser };
