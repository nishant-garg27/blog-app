const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require('crypto');

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true, // Clean extra spaces
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true, 
    },
    salt: {
        type: String, // FIX: Removed required: true so validation passes
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/Images/default.jpeg',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedPass = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    user.salt = salt;
    user.password = hashedPass;

    next();
});

const User = model('user', UserSchema);
module.exports = User;