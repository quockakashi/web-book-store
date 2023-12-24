const { json } = require('express');
const productModel = require('../models/productModel');
const { ObjectId } = require('mongoose').Types;

const renderHomePage = async(req, res) => {
    res.render('homepage', {title: 'Home | HCMUS Book Store'})
}

// get 30 top rating books
const getTopRating = async(req, res, next) => {
    try {
        const books = await productModel.aggregate([
            {$lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }},
            {$project: {
                _id: '$_id',
                name: 1,
                price: 1,
                image: '$image.url',
                publishDate: 1,
                rating: {$avg: '$reviews.rating'}
            }},
            {$sort: {rating: -1}},
            {$limit: 30},
            {$lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'products.product',
                let: {productId: '$_id'},
                as: 'orders',
                pipeline: [
                    {$unwind: '$products'},
                    {$match: {
                        $expr: {
                            $eq: ['$products.product', '$$productId']
                        }
                    }},
                ]
            }},
            {
                $addFields: {sold: {$sum: '$orders.products.quantity'}}
            }
        ])


        res.status(200).json({
            data: books,
        })

    } catch(error) {
        console.error(error);
        next(error);
    }
}

// get 30 new books
const getNewBooks = async(req, res, next) => {
    try {
        const books = await productModel.aggregate([
            {$sort: {publishDate: -1}},
            {$limit: 30},
            {$lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }},
            {$lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'products.product',
                let: {productId: '$_id'},
                as: 'orders',
                pipeline: [
                    {$unwind: '$products'},
                    {$match: {
                        $expr: {
                            $eq: ['$products.product', '$$productId']
                        }
                    }},
                ]
            }},
            {$project: {
                _id: '$_id',
                name: 1,
                price: 1,
                image: '$image.url',
                publishDate: 1,
                rating: {$avg: '$reviews.rating'},
                sold: {$sum: '$orders.products.quantity'},
            }}
        ])

        res.status(200).json({
            data: books,
        })

    } catch(error) {
        console.error(error);
        next(error);
    }
}

// get 30 best seller
const getBestSeller = async(req, res, next) => {
    try {
        const books = await productModel.aggregate([
            {$lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }},
            {$lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'products.product',
                let: {productId: '$_id'},
                as: 'orders',
                pipeline: [
                    {$unwind: '$products'},
                    {$match: {
                        $expr: {
                            $eq: ['$products.product', '$$productId']
                        }
                    }},
                ]
            }},
            {$project: {
                _id: '$_id',
                name: 1,
                price: 1,
                image: '$image.url',
                publishDate: 1,
                rating: {$avg: '$reviews.rating'},
                sold: {$sum: '$orders.products.quantity'},
            }},
            {$sort: {sold: -1}},
            {$limit: 30},
        ])

        res.status(200).json({
            data: books,
        })

    } catch(error) {
        console.error(error);
        next(error);
    }
}

const getKidBooks = async(req, res, next) => {
    try {
        const books = await productModel.aggregate([
            {$match: {
                categories: {$elemMatch: {$in: [new ObjectId('65755868fdb76f5b6d134adf'), new ObjectId('65746d64f335dbb5f5df5647')]}}
            }},
            {$lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }},
            {$lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'products.product',
                let: {productId: '$_id'},
                as: 'orders',
                pipeline: [
                    {$unwind: '$products'},
                    {$match: {
                        $expr: {
                            $eq: ['$products.product', '$$productId']
                        }
                    }},
                ]
            }},
            {$project: {
                _id: '$_id',
                name: 1,
                price: 1,
                image: '$image.url',
                publishDate: 1,
                rating: {$avg: '$reviews.rating'},
                sold: {$sum: '$orders.products.quantity'},
            }},
        ])

        res.status(200).json({
            data: books,
        })

    } catch(error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    renderHomePage,
    getNewBooks,
    getTopRating,
    getBestSeller,
    getKidBooks,
}