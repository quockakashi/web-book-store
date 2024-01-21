const transactionModel = require('../models/transactionModel');
const walletModel = require('../models/walletModel');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.TRANSACTION_SECRET_KEY;

const createNewTransaction = async(req, res, next) => {
    try {
        const { type, from, to, amount } = req.body;

        const transaction = await transactionModel.create({type, from, to, amount});
        if(type == 'deposit') {
            const wallet = await walletModel.findById(from);
            wallet.balance += amount;
            await wallet.save();
        } else if(type == 'payment') {
            const toWallet = await walletModel.findById(to);
            const fromWallet = await walletModel.findById(from);
            toWallet.balance += amount;
            fromWallet.balance -= amount;
            await toWallet.save();
            await fromWallet.save();
        }

        return res.status(201).json({
            message: 'transaction created',
            data: transaction,
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error,
        })
    }
};

const getAllTransactionByWalletId = async(req, res, next) => {
    const { walletId } = req.body;

    const transactions = await transactionModel.find({from: walletId}).sort({createdAt: -1}).lean();

    return res.status(200).json({
        data: transactions,
    })
}

const getTransactionsOverview = async (req, res, next) => {
    try {
        const { walletId, duration } = req.body;
        const data = [];
        const current = new Date();
        const startCurrentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
        if(duration === 'last-7-days') {
            for(let i = 0; i < 7; i++) {
                const date = new Date(startCurrentDate);
                date.setDate(date.getDate() - i);
                const endDate = new Date(startCurrentDate);
                endDate.setDate(date.getDate() + 1);

                const transactions = await transactionModel.find({
                    from: walletId,
                    createdAt: { $gte: date, $lt: endDate },
                });
                let income = 0;
                let outcome = 0;
                transactions.forEach(transaction => {
                    if(transaction.type == 'deposit') {
                        income += transaction.amount;
                    } else {
                        outcome += transaction.amount;
                    }
                })
                const name = date.toLocaleDateString('en-UK', { dateStyle: 'medium' }).slice(0, 6).trim();
                data.push({
                    name,
                    income,
                    outcome,
                })
            }
        }
        else {
            let month = current.getMonth();
            let year = current.getFullYear();
            for (let i = 0; i < 12; i++) {
                
                const startMonth = new Date(year, month, 1);
                const endMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

                const transactions = await transactionModel.find({
                    from: walletId,
                    createdAt: { $gte: startMonth, $lte: endMonth },
                });
                let income = 0;
                let outcome = 0;
                transactions.forEach(transaction => {
                    if(transaction.type == 'deposit') {
                        income += transaction.amount;
                    } else {
                        outcome += transaction.amount;
                    }
                })
                const name = startMonth.toLocaleDateString('en-UK', { dateStyle: 'medium' }).slice(2,);
                data.push({
                    name,
                    income,
                    outcome
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
            message: 'Transaction info',
            data,
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = {
    createNewTransaction,
    getAllTransactionByWalletId,
    getTransactionsOverview,
};

