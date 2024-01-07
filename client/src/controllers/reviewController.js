const reviewModel = require('../models/reviewModel');
const { ObjectId } = require('mongoose').Types;

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1702191078/book-store-system/products/709158-200_dbqhpd.png';
const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1700707173/book-store-system/avatars/default-avatar.png';

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

const getAllReviewsByProductId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviews = await reviewModel
                            .find({product: id}, 'createdAt content rating')
                            .populate('product', 'name image')
                            .populate('user', 'fullName username avatar')
                            .sort([['cratedAt', -1]]);
        reviews.forEach(review => {
            if(!review.user.avatar?.url) {
                review.user.avatar = {url: DEFAULT_AVATAR_URL}
            }
        })

        return res.status(200).json({
            message: 'List reviews',
            data: reviews,
        })

    } catch(err) {}
};

const postReview = async(req, res, next) => {
    try {
        const {
            rating, content, product
        } = req.body;
        const userId = req.user._id;

        const review = {
            content, 
            product,
            user: userId,
        }
        if(rating > 0) {
            review.rating = rating
        }

        const storedReview = await reviewModel.create(review);

        res.status(201).json({
            message: 'Created review',
            data: {
                review: storedReview,
                user: {
                    avatar: req.user.avatar,
                    username: req.user.username,
                }
            }
        });

    } catch(error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    getReviewsByUser,
    postReview,
    getAllReviewsByProductId,
}