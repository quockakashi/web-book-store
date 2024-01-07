const { json } = require('express');
const productModel = require('../models/productModel');
const { search } = require('../routers');
const { ObjectId } = require('mongoose').Types;

const DEFAULT_PER_PAGE = 12;

const renderHomePage = async(req, res) => {
    res.render('homepage', {layout: 'layouts/main', title: 'Homepage', user: req.user})
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
        return res.render('product-detail', {layout: '/layouts/main', title: product[0].name.slice(0, 20) + '...',product : product[0], user: req.user});
    } catch(error) {
        console.error(error);
    }
}

const renderSearchBookPage = async(req, res, next) => {
    res.render('search-books', {layout: 'layouts/main', title: 'Books'});
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

const getBooks = async(req, res, next) => {
    try {
        let {
            keyword, sortDir, sortBy, minPrice, maxPrice, ratingFilter, cat, page
        } = req.query;

        if(minPrice) {
            minPrice = parseFloat(minPrice) || 0;
        };

        if(maxPrice) {
            maxPrice = parseFloat(maxPrice);
        }
        ratingFilter = parseInt(ratingFilter) || 0;

        page = parseInt(page) || 1;

        sortBy = sortBy ? sortBy : 'name';
        sortDir = sortDir ? sortDir : 'asc';
        let searchCondition = {};
        if(keyword) {
            // search by keyword with name and authors
            searchCondition = {
                $or: [
                    {name: new RegExp(`.*${keyword}.*`, 'i')},
                    {authors: new RegExp(`.*${keyword}.*`, 'i')}
                ]
            }
        }
        // and attach with catid
        if(cat) {
            searchCondition.categories = new ObjectId(cat);
        };
        if(Number.isFinite(minPrice)) {
            searchCondition.price = {
                $gte: minPrice,
            };
        }
        if(Number.isFinite(maxPrice) ) {
            searchCondition.price.$lte = maxPrice;
        }

        const products = await productModel.aggregate([
            {$match: searchCondition},
            {$lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews',
                pipeline: [
                    {$project: {
                        rating: 1,
                    }}
                ]
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
            {$addFields: {
                sold: {$sum: '$orders.products.quantity'}
            }},
            {$addFields: {
                rating: {$ifNull: [{$avg: '$reviews.rating'}, 0]}
            }},
            {$match: {
                rating: {$gte: ratingFilter}
            }},
            {$facet: {
                _metadata: [
                    {$count: 'total_count'}
                ],
                data: [
                    {$sort: {[sortBy]: sortDir === 'asc' ? 1 : -1}},
                    {$skip: (page - 1) * DEFAULT_PER_PAGE},
                    {$limit: DEFAULT_PER_PAGE},
                    {$project: {
                        _id: 1,
                        name: 1,
                        price: 1,
                        image: '$image.url',
                        publishDate: 1,
                        rating: 1,
                        sold: 1,
                    }}
                ]
            }}
        ]);

        const total_count = products[0]._metadata[0]?.total_count || 0;
        const page_count = Math.ceil(total_count / DEFAULT_PER_PAGE) || 1; 


        res.status(200).json({
            _metadata: {
                total_count,
                page_count,
                page,
                per_page: DEFAULT_PER_PAGE,
            },
            data: products[0].data,
        })


    } catch(error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    renderHomePage,
    renderProductDetails,
    renderSearchBookPage,
    getNewBooks,
    getTopRating,
    getBestSeller,
    getKidBooks,
    getBookSameCategories,
    getBooks,
}