const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
}, {versionKey: false, timestamps: true});

const walletModel = mongoose.model('wallet', walletSchema);

module.exports = walletModel;