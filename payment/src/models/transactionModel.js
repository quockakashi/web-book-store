const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const transactionSchema = new mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'wallet'
    },
    to: {
        type: ObjectId,
        ref: 'wallet'
    },
    type: {
        type: String,
        enum: ['deposit', 'transfer', 'payment'],
    },
    amount: Number,
}, {versionKey: false, timestamps: true});

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;