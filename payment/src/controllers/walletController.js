const walletModel = require('../models/walletModel.js');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.TRANSACTION_SECRET_KEY;

const createNewWallet = async(req, res, next) => {
    try {
        const { type } = req.body;

        const wallet = await walletModel.create({type});

        return res.status(201).json({
            message: 'Wallet created',
            data: {
                id: wallet._id,
            }
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error,
        })
    }
};

const getBalance = async(req, res, next) => {
    try {
        const {walletId} = req.body;

        const wallet = await walletModel.findById(walletId).lean();

        return res.status(200).json({
            data: {
                _id: wallet._id,
                balance: wallet.balance,
            }
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error,
        })
    }
}

const getMainWalletInfo = async(req, res, next) => {
    try {

        const wallet = await walletModel.findById(process.env.MAIN_WALLET);

        return res.status(200).json({
            data: wallet
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error,
        })
    }
}

module.exports = {
    createNewWallet,
    getBalance,
    getMainWalletInfo
};

