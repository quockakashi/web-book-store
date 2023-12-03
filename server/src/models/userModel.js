const mongoose = require('mongoose');
const regexPatterns = require('../utils/regexUtils');
const cloudinary = require('../configs/cloudinary');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: 64,
    },
    username: {
        type: String,
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

userSchema.pre('deleteOne', {document: true, query: false}, async function(doc) {
    console.log('This is a function called before an user deleted');
    if(doc && doc.avatar) {
     await cloudinary.uploader.destroy(doc.avatar.public_id);
    }
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;