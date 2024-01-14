const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    authors: [String],
    publisher: String,
    publishDate: Date,
    pages: Number,
    language: String,
    categories: [{type: ObjectId, ref: 'category'}],
    description: String,
    stock: Number,
    image: {
        public_id: String,
        url: String,
    },
    preview: String,
}, {
    versionKey: false,
    timestamps: true,
});

module.exports = mongoose.model('product', productSchema);