const { json } = require('express');
const productModel = require('../models/productModel');
const { ObjectId } = require('mongoose').Types;

const renderHomePage = async(req, res) => {
    res.render('homepage', {layout: 'layouts/main', title: 'Homepage'})
};

const renderProductDetails = async(req, res) => {
    try {
        const { id } = req.params;
        if(!ObjectId.isValid(id)) {
            return res.render('errors/404');
        }

        const product = await productModel.aggregate([
            {$match: {_id: new ObjectId(id)}},
            {$lookup: {
                from: 'categories',
                localField: 'categories',
                foreignField: '_id',
                as: 'categories',
                pipeline: [
                    {$project: {
                        _id: 1,
                        name: 1,
                    }}
                ]
            }},
            {$lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews',
            }},
            {$project: {
                _id: '$_id',
                name: 1,
                price: 1,
                image: '$image.url',
                publishDate: 1,
                rating: {$avg: '$reviews.rating'},
                reviews: {$size: '$reviews'},
                categories: 1,
                authors: 1,
                stock: 1,
                publisher: 1,
                pages: 1,
                description: 1, 
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
            {
                $addFields: {sold: {$sum: '$orders.products.quantity'}}
            }
        ]);

        if(product.length == 0) {
            return res.render('errors/404');
        } 

        if(product[0].publishDate) {
            product[0].publishDate = (new Date(product[0].publishDate)).toLocaleDateString('en-UK', {dateStyle: 'medium'})
        }
        return res.render('product-detail', {layout: '/layouts/main', title: product[0].name.slice(0, 20) + '...',product : product[0]});
    } catch(error) {
        console.error(error);
    }
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
};

const getBookSameCategories = async(req, res, next) => {
    try {
        const { id } = req.params;
        const data = await productModel.aggregate(
            [
                {$match: {_id: new ObjectId(id)}},
                {$unwind: '$categories'},
                {$lookup: {
                    from: 'products',
                    localField: 'categories',
                    foreignField: 'categories',
                    as: 'products',
                    pipeline: [
                        {$match: {_id: {$ne: new ObjectId(id)}}},
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
                    ]
                }},
                {$lookup: {
                    from: 'categories',
                    localField: 'categories',
                    foreignField: '_id',
                    as: 'category',
                    pipeline: [
                        {$project: {
                            _id: 1,
                            name: 1,
                        }}
                    ]
                }},
                {$unwind: '$category'},
                {$project: {
                    category: 1,
                    _id: 0,
                    products: 1,
                }}
            ]
        )

        res.json({
            data
        })

    } catch(error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    renderHomePage,
    renderProductDetails,
    getNewBooks,
    getTopRating,
    getBestSeller,
    getKidBooks,
    getBookSameCategories,
}