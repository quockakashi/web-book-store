const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const reviewSchema = new mongoose.Schema({
    user: {type: ObjectId, ref: 'user'},
    product: {type: ObjectId, ref: 'product'},
    content: String,
    rating: Number,
}, {
    timestamps: true,
    versionKey: false,
});

const reviewModel = mongoose.model('review', reviewSchema);

module.exports = reviewModel;