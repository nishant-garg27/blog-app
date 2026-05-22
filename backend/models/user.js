const { Schema, model } = require("mongoose");
const { createHmac, randomBytes, hash } = require('crypto');
const { error } = require("console");

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true, 
    },
    salt: {
        type: String, 
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

UserSchema.pre('save', function () {
    const user = this;

    if (!user.isModified("password")) {
        return;
    }

    const salt = randomBytes(16).toString('hex');

    const hashedPass = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    user.salt = salt;
    user.password = hashedPass;
});

UserSchema.static('matchPassword',async function (email, password) {
    const user = await this.findOne({email})
    if(!user) throw new Error('user not found');
    const salt = user.salt;
    const hashedPass= user.password;

    const userhash = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');
    if(hashedPass !== userhash) throw new Error('Password Incorrect');
    return {... user , password: undefined, salt: undefined};
})

const User = model('user', UserSchema);
module.exports = User;