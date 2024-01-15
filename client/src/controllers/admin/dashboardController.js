const userModel = require('../../models/userModel');
const orderModel = require('../../models/orderModel');
const productModel = require('../../models/productModel');

const renderDashboardPage = async (req, res) => {
    const now = new Date();

    // calculate weekly revenue
    // get orders in last 7 days and completed
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() -  7);
    const twoWeekAgo = new Date(now);
    twoWeekAgo.setDate(now.getDate() - 14);
    let ordersLast14Days = await orderModel.find({
        status: 'completed',
        createdAt: {$gt: twoWeekAgo},
    }).populate('products.product').lean();


    let lastWeekRevenue = 0;
    let inPrevLastWeekRevenue = 0;
    ordersLast14Days.forEach((order) => {
        let total = 0;
        order.products.forEach(elem => {   
            total += elem.product.price * elem.quantity;
        });

        if(order.createdAt >= sevenDaysAgo) {
            lastWeekRevenue += total;
        } else {
            inPrevLastWeekRevenue += total;
        }
    });

    const weeklyRevenue = {
        data: lastWeekRevenue,
        compare: {
            status: lastWeekRevenue > inPrevLastWeekRevenue ? 'increased' : lastWeekRevenue - inPrevLastWeekRevenue ? 'decreased' : 'same',
            increasedBy: inPrevLastWeekRevenue ? (Math.abs(lastWeekRevenue - inPrevLastWeekRevenue) / inPrevLastWeekRevenue).toFixed(2) : 0
        }
    };

    // monthly orders
    const monthAgo = new Date();
    monthAgo.setDate(now.getDate() - 30);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setDate(now.getDate() - 60);
    const numberLastMonthOrders = await orderModel.countDocuments({createdAt: {$gt: monthAgo}});
    const numberPrevLastMonthOrders = await orderModel.countDocuments({createdAt: {$gt: twoMonthsAgo, $lt: monthAgo}});

    const monthlyOrder = {
        data: numberLastMonthOrders,
        compare: {
            status: numberLastMonthOrders > numberPrevLastMonthOrders ? 'increased' : numberLastMonthOrders < numberPrevLastMonthOrders ? 'decreased' : 'same',
            increasedBy: Math.abs(numberLastMonthOrders - numberPrevLastMonthOrders),
        },
    }

    // calculate totalBook
    const numberOfBooks = await productModel.countDocuments();
    const lastMonthAddedBooks = await productModel.countDocuments({createdAt: {$gt: monthAgo}});
    const totalBooks = {
        data: numberOfBooks,
        compare: {
            status:lastMonthAddedBooks ? 'increased' : 'same',
            increasedBy: lastMonthAddedBooks,
        },
    };

    // calculate total users
    const numberUsers = await userModel.countDocuments();
    const usersAddedLastMonth = await userModel.countDocuments({createdAt: {$gt: monthAgo}});
    const totalUsers = {
        data: numberUsers,
        compare: {
            status: usersAddedLastMonth ? 'increased' : 'same',
            increasedBy: usersAddedLastMonth,
        },
    };

    // get orders in process
    let seeMoreOrder = false;
    let ordersInProcess = await orderModel.find({
        status: 'processing'
    }).sort({creatingAt: -1}).limit(5).populate('products.product').lean();

    if(ordersInProcess.length > 4) {
        seeMoreOrder = true;
        ordersInProcess = ordersInProcess.slice(0, 4);
    }

    ordersInProcess.forEach(order => {
        let total = 0;
        order.products.forEach(ele => {
            total += ele.product.price * ele.quantity;
        })
        order.total = total;
        order.createdAt = order.createdAt.toLocaleDateString('en-UK', {dateStyle: 'medium'})
    });

    // revenue by customer
    const topCustomers = await getTopUserByRevenue();


    res.render('admin/dashboard/index', 
        {
            layout: 'admin/layouts/index', 
            title: 'Home - HCMUS Book Store System',
            component: 
            {
                name: 'Dashboard', 
                subtitle: `Welcome ${req.user?.fullName}!`
            }, 
            user: req.user,
            weeklyRevenue,
            monthlyOrder,
            totalBooks,
            totalUsers,
            ordersInProcess,
            seeMoreOrder,
            topCustomers,
        });
};

const getTopUserByRevenue = async() => {
    const customers = await orderModel.aggregate([
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
            total: {$multiply: ['$products.quantity', '$product.price']},
        }},
        {$lookup: {
            from: 'users',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer',
        }},
        {$group: {
            _id: {
                username: '$customer.username',
                avatar: '$customer.avatar.url',
            },
            total: {$sum: '$total'},
            orders: {$addToSet: '$_id'}
        }},
        {$project: {
            _id: 0,
            username: {$first: '$_id.username'},
            avatar: {$first: '$_id.avatar'},
            total: 1,
            orders: {$size: '$orders'}
        }},
        {$sort: {total: -1}}

    ]);

    return customers;
}

module.exports = {
    renderDashboardPage,
}