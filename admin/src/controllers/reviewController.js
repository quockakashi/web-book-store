const reviewModel = require('../models/reviewModel');
const { ObjectId } = require('mongoose').Types;

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1702191078/book-store-system/products/709158-200_dbqhpd.png';

const getReviewsByUser = async (req, res, next) => {
    try {
        const { userId } = req.query;
        const reviews = await reviewModel
                            .find({user: userId}, 'createdAt content rating')
                            .populate('product', 'name image')
                            .sort([['cratedAt', -1]]);
        reviews.forEach(review => {
            if(review.product.image?.public_url) {
                review.product.image = product.image.url;
            } else {
                review.product.image = DEFAULT_IMAGE_URL;
            }
        })

        console.log(reviews)

        return res.status(200).json({
            message: 'List reviews of user',
            data: {
                reviews,
            }
        })

    } catch(err) {}
};

module.exports = {
    getReviewsByUser,
}