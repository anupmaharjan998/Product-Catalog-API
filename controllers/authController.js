const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE || '30d'}
    );
};

// Register User
exports.register = async (req, res) => {
    const {username, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new Error('Email already in use');
    }

    const user = await User.create({username, email, password});
    const token = generateToken(user.userId);

    res.status(201).json({
        success: true,
        token,
        user: {
            id: user.userId,
            username: user.username,
            email: user.email
        }
    });
};

// Login User
exports.login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new Error('Please provide email and password');
    }

    const user = await User.findOne({email}).select('+password');
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user.userId);

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user.userId,
            username: user.username,
            email: user.email
        }
    });
};
