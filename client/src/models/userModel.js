const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username: {
        type:  String,
        required: [true, 'Username is required'],
    },
    fullName: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: 64,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email required!'],
        unique: true,
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',
    },
    avatar: {
        public_id: String,
        url: String,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        default: 'local',
    },
    wallet: {
        type: ObjectId,
        ref: 'wallet',
    },
    address: String,
}, {versionKey: false, timestamps: true});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;