const orderModel = require('../models/orderModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const NUMBER_ORDER_PER_PAGE = 5;

const getOrdersByUser  = async(req, res, next) => {
    try {
        const { userId } = req.query;
        if(!userId) {
        return res.status(400).json({
            message: 'Query must include user id',
        })
        };
        const orders = await orderModel.aggregate([
            {$match: {customer: new ObjectId(userId)}},
            {$unwind: '$products'},
            {$lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'product'
            }},
            {$unwind: '$product'},
            {$group: {
                _id: {
                    _id: '$_id',
                    orderId: '$orderId',
                    createdAt: '$createdAt',
                    status: '$status'
                },
                total: {$sum: {$multiply: ['$products.quantity', '$product.price']}}
            }},
            {$project: {
                _id: '$_id._id',
                orderId: '$_id.orderId',
                createdAt: '$_id.createdAt',
                status: '$_id.status',
                total: 1
            }
            },
            {$sort: {createdAt: -1}}
        ]);


    return res.status(200).json({
        message: `List orders of user ${userId}`,
        data: {
            orders,
        }
    })
    } catch(err) {
        console.error(err);
        next(err);
    }
}

module.exports = {
    getOrdersByUser,
}