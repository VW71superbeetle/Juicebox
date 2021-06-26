// Environment Variables
require('dotenv').config();
const { PORT = 3000 } = process.env

//Requires
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiRouter = require('./api');
const { client } = require('./db');

// Setup
const server = express();
server.use(bodyParser.json());
server.use(morgan('dev'));
server.use('/api', apiRouter);
client.connect();


server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
});


server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});