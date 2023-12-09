const mongoose = require('mongoose');
const regexPatterns = require('../utils/regexUtils');

const userSchema = new mongoose.Schema({
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
        validate: {
            validator: function(v) {
                return regexPatterns.email.test(v);
            },
            message: props => `${props.value} is not a valid email!`,
        }
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: (v) => regexPatterns.phoneNumber.test(v),
            message: props => `${props.value} is not a valid phone number!`
        }
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
    }
}, {versionKey: false, timestamps: true});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;