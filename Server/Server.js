const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const Router = require('./Router');

const app = express();

//! 1) MIDDLEWARES

app.use(cors({}));

app.use(express.json());

//! 2) ROUTE

app.use('/api', Router);

//! 3) MOONGO DB CONNECTİON

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URI)
    .then((result) => {
        console.log('\x1b[31m%s\x1b[0m', 'Connected to DB');
    }).catch((err) => {
        console.error('\x1b[31m%s\x1b[0m', "Failed to Connect Database", err);
    });

//! 4) GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

//! 5) SERVER

app.listen(process.env.PORT, () => {
    console.log('\x1b[31m%s\x1b[0m', `App Running On ${process.env.PORT}`);
});

