const express = require('express');
const http = require('http');
require('dotenv').config();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const hbs = require('./configs/hbs');
const session = require('express-session');

// import database
const connectDB = require('./configs/database');
// connect database
connectDB();

// import passport
const passport = require('./configs/passport');

// import middlewares
const {errorHandler, notFound} = require('./middlewares/errorHandler');

const path = require('path');

const router = require('./routers');

// create app
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

// set up view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// config session
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: 'strict',
    }
}))
app.use(passport.session());

app.use(morgan('dev'));

app.use('/', router);


// create server
const server = http.createServer(app);
// listen on the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
})