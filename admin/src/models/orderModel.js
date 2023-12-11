const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const orderSchema = new mongoose.Schema({
    customer: {
        type: ObjectId,
        ref: 'user'
    },
    orderId: String,
    products: [
        {
            product: {
                type: ObjectId,
                ref: 'product',
            },
            quantity: Number,
        }
    ],
    status: String,
}, {
    versionKey: false,
    timestamps: true,
});

module.exports = mongoose.model('order', orderSchema);