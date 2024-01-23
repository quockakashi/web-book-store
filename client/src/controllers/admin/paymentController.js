const jwt = require('jsonwebtoken');

const renderPaymentPage = async(req, res, next) => {
    return res.render('admin/payment/payment-page', {layout: 'admin/layouts/index', title: "Payment Management",
    component: {
        name: "Payment",
        subtitle: "Payment Management",
    },user: req.user})
}

const getMainWallet = async(req, res, next) => {
    const body = {}
    const walletResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/wallet/main-wallet`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
    })});

    const data = (await walletResponse.json()).data;

    res.status(200).json({
        data: data
    });
};

const getAllPayment = async(req, res, next) => {
    const body = {}
    const walletResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/transactions/payments`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
    })});

    const data = (await walletResponse.json()).data;

    res.status(200).json({
        data: data
    })
}

const getOverview = async(req, res, next) => {
    const {by} = req.query;
    const body = {duration: by}
    const walletResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/transactions/overview-main-wallet`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
    })});

    const data = (await walletResponse.json()).data;

    res.status(200).json({
        data: data
    })
}

module.exports = {
    renderPaymentPage,
    getMainWallet,
    getAllPayment,
    getOverview,
}