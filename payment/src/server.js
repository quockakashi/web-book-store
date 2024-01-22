const express = require('express');
const http = require('http');
require('dotenv').config();
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const connectDB = require('./configs/database');
const https = require('https');
const fs = require('fs');
const path = require('path');

connectDB();


const walletRouter = require('./routers/walletRouter');
const transactionRouter = require('./routers/transactionRouter');



const app = express();

app.use(express.json());

app.use(morgan('dev'));


app.use('/', async (req, res, next) => {
    try {
        const { token } = req.body;
        payload = await jwt.verify(token, process.env.TRANSACTION_SECRET_KEY);
        req.body = payload;
        next();
    } catch(error) {
        console.error(error);
        return res.status(301).json({
            message: "Unauthorized",
        })
    }
});

app.use('/api/wallet', walletRouter);
app.use('/api/transactions', transactionRouter);



// create server
const server = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname,'..', 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname,'..', 'cert', 'cert.pem')),
    },
    app);
// listen on the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
})