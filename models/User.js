const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');
const ROLES = require('../utils/roles');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: 'customer'
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);