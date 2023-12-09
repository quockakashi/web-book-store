const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: String,
    description: String,
},
{
    versionKey: false,
    timestamps: true,
});

const categoryModel = mongoose.model('category', CategorySchema, 'categories');

module.exports = categoryModel;