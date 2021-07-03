const {models} = require('../database');
const {statusCodes} = require('../constants');
const { authValidator } = require('../validators');
const {
    ErrorHandler,
    errorMessages: {
        EMAIL_ALREADY_EXIST, UNAUTHORIZED
    }
} = require('../errors');
const { tokenService } = require('../services');

class AuthMiddleware {
    async checkUniqueEmail(req, res, next) {
        try {
            const {email} = req.body;

            const candidate = await models.User.findOne({email});

            if (candidate) {
                throw new ErrorHandler(
                    statusCodes.ALREADY_EXIST,
                    EMAIL_ALREADY_EXIST.message,
                    EMAIL_ALREADY_EXIST.code
                );
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    checkRegistrationBody(req, res, next) {
        try {

            const { error } = authValidator.chekRegistrationBody.validate(req.body);

            if (error) {
                _badRequestBody(error);
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    checkLoginBody(req, res, next) {
        try {

            const { error } = authValidator.chekLoginBody.validate(req.body);

            if (error) {
                _badRequestBody(error);
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    checkRefreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                _unauthorizedError();
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    checkIsAuthtorized(req, res, next) {
        try {
            const { authorization } = req.headers;
            console.log(authorization)
            if (!authorization) {
                _unauthorizedError();
            }

            const accessToken = authorization.split(' ')[1];

            if (!accessToken) {
                _unauthorizedError();
            }

            const userData = tokenService.validateAccessToken(accessToken);

            if (!userData) {
                _unauthorizedError();
            }

            req.user = userData;

            next();
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthMiddleware();

function _badRequestBody(error) {
    throw new ErrorHandler(
        statusCodes.BAD_REQUEST,
        error.details[0].message,
        statusCodes.BAD_REQUEST
    )
}

function _unauthorizedError() {
    throw new ErrorHandler(
        statusCodes.UNAUTHORIZED,
        UNAUTHORIZED.message,
        UNAUTHORIZED.code
    )
}