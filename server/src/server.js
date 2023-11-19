const express = require('express');
const http = require('http');
require('dotenv').config();
const morgan = require('morgan');

// create app
const app = express();

app.use(morgan('dev'));


// create server
const server = http.createServer(app);
// listen on the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
})