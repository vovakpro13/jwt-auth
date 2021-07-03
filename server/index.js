const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { authRouter } = require('./routes');
const {config, statusCodes} = require('./constants');
const { ErrorHandler, errorMessages: {
    ROUTE_NOT_FOUND
}} = require('./errors');

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/*', _notFoundHendler);

app.use(_errorHandler);

app.listen(config.PORT, () => console.log(`Server started on ${config.PORT}`));

function _errorHandler(err, req, res, next) {
    res
        .status(err.status || statusCodes.BAD_REQUEST)
        .json({
            message: err.message || 'UNKNOWN_ERROR',
            customCode: err.code || 0
        });
}

function _notFoundHendler(req, res, next) {
    next(new ErrorHandler(statusCodes.NOT_FOUND, ROUTE_NOT_FOUND.message, ROUTE_NOT_FOUND.code));
}

