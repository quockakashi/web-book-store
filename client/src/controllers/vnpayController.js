const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');
const sortObject = require('sortobject').default;
const jwt = require('jsonwebtoken');

const createPayment = async (req, res) => {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var secretKey = process.env.VNP_HASHSECRET;
    const date = moment();
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = date.format('HHmmss');
    vnp_Params['vnp_OrderInfo'] = "BookStore";
    vnp_Params['vnp_OrderType'] = "other";
    vnp_Params['vnp_Amount'] = req.query.amount * 100;
    vnp_Params['vnp_ReturnUrl'] = process.env.VNP_RETURN_URL;
    vnp_Params['vnp_CreateDate'] = date.format('YYYYMMDDHHmmss');
    vnp_Params = sortObject(vnp_Params);
    var signData = querystring.stringify(vnp_Params, { encode: true });
    console.log(signData);
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    const vnpUrl = process.env.VNP_URL + '?' + querystring.stringify(vnp_Params, { encode: true });
    // res.redirect(vnpUrl)
    const returnData = {
        message: 'Success',
        id: date.format('HHmmss'),
        data: vnpUrl
    };
    res.json(returnData);
}
const confirmPayment = async (req, res) => {
    try {
        if (req.query?.vnp_ResponseCode == '00') {
            const order_id = req.query?.vnp_TxnRef;
            const total = (req.query?.vnp_Amount || 0) / 100;
            const note = req.query?.vnp_OrderInfo;
            const vnp_response_code = req.query?.vnp_ResponseCode;
            const code_vnpay = req.query?.vnp_TransactionNo;
            const code_bank = req.query?.vnp_BankCode;
            const time = req.query?.vnp_PayDate;
            const date_time = `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12, 14)}`;


            //Thực hiện thêm Đơn hàng
            res.json({ status: "ok", message: "GD thanh cong" });
        } else {
            res.json({ status: "failed", message: "GD that bai" });
        }
    } catch (error) {
        console.error(error);
        res.json({ status: "error", message: "GD da xay ra loi" });
    }
}

const handleDeposit = async(req, res, next) => {
    const {vnp_ResponseCode, vnp_Amount} = req.query;
    

    if (vnp_ResponseCode == '00') {
        console.log('Success');
        const user = req.user;
        const userWallet = req.user.wallet;
        const body = {
            amount: vnp_Amount / 100,
            from: userWallet,
            type: 'deposit',
            to: process.env.MAIN_WALLET
        }

        const transactionResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/transactions`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
        })});

        const data = (await transactionResponse.json()).data;
        req.flash('type', 'deposit');
        req.flash('status', 'success');
        req.flash('amount', data.amount);
        req.flash('transaction', data._id);
        return res.redirect('/transaction-status');
    } else {
        console.log('That bai');
        req.flash('type', 'deposit');
        req.flash('status', 'failure');
        return res.redirect('/transaction-status');
    }
}
module.exports = {
    createPayment,
    confirmPayment,
    handleDeposit
}