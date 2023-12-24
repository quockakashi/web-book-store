const categoryModel = require('../models/categoryModel');

const getCategories = async(req, res, next) => {
    try {
        const categories = await categoryModel.find({})
                .select('_id name')
                .sort([['name', 1]]).lean();

        res.status(200).json({
            data: categories
        })
    } catch(error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    getCategories,
}