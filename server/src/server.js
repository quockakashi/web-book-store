const express = require('express');
const http = require('http');
require('dotenv').config();
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookierpasser = require('cookie-parser');

// import database
const connectDB = require('./configs/database');
// connect database
connectDB();

// import passport
const passport = require('./configs/passport');

// import middlewares
const {errorHandler, notFound} = require('./middlewares/errorHandler');

// import api router
const apiRouter = require('./routers/index');
const router = require('./routers');

// create app
const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookierpasser());
app.use(fileupload());

app.use('/api', router);

//handle error
app.use(errorHandler);

// create server
const server = http.createServer(app);
// listen on the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
})