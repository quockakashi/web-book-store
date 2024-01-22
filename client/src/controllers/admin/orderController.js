const categoryModel = require('../../models/categoryModel');
const orderModel = require('../../models/orderModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const NUMBER_ORDER_PER_PAGE = 5;

/** render pages */
// render order management page
const renderOrderPage = async (req, res, next) => {
    try {
        let { page, sortBy, sortDir, search, status } = req.query;
        page = parseInt(page) || 1;
        sortBy = sortBy || "createdAt";
        sortDir = sortDir || "desc";

        let matchedOrders = await orderModel
            .find()
            .sort([[sortBy, sortDir == "asc" ? 1 : -1]])
            .populate('products.product customer')
            .lean();

        if (search) {
            matchedOrders = matchedOrders.filter(order => {
                const regex = new RegExp(`.*${search.toLowerCase()}.*`, 'i');
                return regex.test(order._id.toString()) ||
                    regex.test(order.customer.username) ||
                    regex.test(order.orderId)
            })
        }


        if (status) {
            matchedOrders = matchedOrders.filter(order => {
                return order.status == status;
            });
        }

        // calculate total 
        matchedOrders.forEach(order => {
            let total = 0;
            order.products.forEach(elem => {
                total += elem.product.price * elem.quantity;
            })
            order.total = total;
            order.createdAt = order.createdAt.toLocaleDateString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' });
        });

        if (sortBy == 'total') {
            if (sortDir == 'asc') {
                matchedOrders = matchedOrders.sort((order1, order2) => order1.total - order2.total);
            } else {
                matchedOrders = matchedOrders.sort((order1, order2) => order2.total - order1.total);
            }
        }

        // pagination
        const orders = matchedOrders.slice(
            (page - 1) * NUMBER_ORDER_PER_PAGE,
            (page - 1) * NUMBER_ORDER_PER_PAGE + NUMBER_ORDER_PER_PAGE
        );

        const totalPage = Math.ceil(matchedOrders.length / NUMBER_ORDER_PER_PAGE);

        const prevPage = page === 1 ? null : page - 1;
        const nextPage = page === totalPage ? null : page + 1;

        res.render("admin/orders/index", {
            layout: "admin/layouts/index",
            title: "Order Management",
            component: {
                name: "Orders",
                subtitle: "Orders Management",
            },
            orders,
            meta: {
                showPagination: totalPage > 1,
                page,
                totalPage,
                prevPage,
                nextPage,
                sortBy,
                sortDir,
                noPrev: !prevPage,
                noNext: !nextPage,
                search,
                hasSearch: !!search,
                status,
                sort: sortBy + '-' + sortDir
            },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// *api
const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await orderModel.findByIdAndUpdate(id, { status });
        if (order) {
            return res.status(200).json({
                message: `Order ${order.orderId} updated status to ${status}!`,
            });
        }
        return res.status(404).json({
            message: `Order not found!`,
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const getYearlyRevenue = async (req, res, next) => {
    try {
        const { by } = req.query;
        const data = [];
        const current = new Date();
        const startCurrentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
        if(by === 'last-7-days') {
            for(let i = 0; i < 7; i++) {
                const date = new Date(startCurrentDate);
                date.setDate(date.getDate() - i);
                const endDate = new Date(startCurrentDate);
                endDate.setDate(date.getDate() + 1);

                const orders = await orderModel.find({
                    status: 'completed',
                    createdAt: { $gte: date, $lt: endDate },
                }).populate('products.product').lean();
                let revenue = 0;
                orders.forEach(order => {
                    order.products.forEach(elm => {
                        revenue += elm.product.price * elm.quantity;
                    })
                })
                const name = date.toLocaleDateString('en-UK', { dateStyle: 'medium' }).slice(0, 6).trim();
                data.push({
                    name,
                    revenue,
                })
            }
        }
        else {
            let month = current.getMonth();
            let year = current.getFullYear();
            for (let i = 0; i < 12; i++) {
                
                const startMonth = new Date(year, month, 1);
                const endMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

                const orders = await orderModel.find({
                    status: 'completed',
                    createdAt: { $gte: startMonth, $lte: endMonth },
                }).populate('products.product').lean();
                let revenue = 0;
                orders.forEach(order => {
                    order.products.forEach(elm => {
                        revenue += elm.product.price * elm.quantity;
                    })
                })
                const name = startMonth.toLocaleDateString('en-UK', { dateStyle: 'medium' }).slice(2,);
                data.push({
                    name,
                    revenue,
                })
                month--;
                if (month == -1) {
                    month = 11;
                    year = year - 1;
                }
            }
        }

        data.reverse();

        return res.status(200).json({
            message: 'Revenue of last 12 months',
            data,
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

// get top revenue by categories or product
const getTopRevenue = async(req, res, next) => {
    try {
        const { by } = req.query; 
        let data = [];
        if(by === 'products') {
            data = await orderModel.aggregate(
                [
                    {$match: {status: 'completed'}},
                    {$unwind: '$products'},
                    {$lookup: {
                        from: 'products',
                        localField: 'products.product',
                        foreignField: '_id',
                        as: 'product',
                    }},
                    {$unwind: '$product'},
                    {$addFields: {
                        total: {$multiply: ['$products.quantity', '$product.price']}
                    }},
                    {$group: {
                        _id: '$product._id',
                        name: {$first: '$product.name'},
                        revenue: {$sum: '$total'}
                    }}
                ]
            )
        } else {
            data = await orderModel.aggregate(
                [
                    {$match: {status: 'completed'}},
                    {$unwind: '$products'},
                    {$lookup: {
                        from: 'products',
                        localField: 'products.product',
                        foreignField: '_id',
                        as: 'productData'
                    }},
                    {$unwind: '$productData'},
                    {$lookup: {
                        from: 'categories',
                        localField: 'productData.categories',
                        foreignField: '_id',
                        as: 'categoryData',
                    }},
                    {
                        $unwind: '$categoryData', // Mở rộng mảng 'categoryData'
                    },
                    {
                        $addFields: {
                            total: {$multiply: ['$products.quantity', '$productData.price']}
                        }
                    },
                    {
                        $group: {
                          _id: '$categoryData._id', // Nhóm theo tên category
                          name: {$first: '$categoryData.name'},
                          revenue: { $sum: '$total' }, // Tính tổng doanh thu cho mỗi category
                        },
                    },
                    
                ]
            )
        }
       

        if(data.length >= 5) {
            const initialVal = {
                name: 'Others',
                revenue: 0,
            }
            data = [...data.slice(0, 4), data.slice(4, ).reduce((accumulator, current) => {accumulator.revenue += current.revenue; return accumulator}, initialVal)];
        }
        res.status(200).json({
            data,
        })
    } catch(err) {
        console.error(err);
        next(err);
    }
}

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

const getOrderById = async(req, res, next) => {
    try {
        const {id} = req.params;
        const order = await orderModel.findById(id).populate('customer products.product');


    return res.status(200).json({
        data: order,
    })
    } catch(err) {
        console.error(err);
        next(err);
    }
}

module.exports = {
    renderOrderPage,
    updateStatus,
    getYearlyRevenue,
    getTopRevenue,
    getOrdersByUser,
    getOrderById
}