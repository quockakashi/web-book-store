const orderModel = require('../models/orderModel');
const mongoose = require('mongoose');

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
        
        if(search) {
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
            order.createdAt = order.createdAt.toLocaleDateString('vi-VN')
        });

        if(sortBy == 'total') {
            console.log(matchedOrders)
            if(sortDir == 'asc') {
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

        res.render("orders/index", {
            layout: "layouts/index",
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
                sort: sortBy+'-'+sortDir
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

module.exports = {
    renderOrderPage,
    updateStatus,
}