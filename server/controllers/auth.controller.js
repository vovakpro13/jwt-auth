const { models: { Token } } = require("../database");
const { authService } = require('../services');
const { config, statusCodes, times } = require('../constants');
const { ErrorHandler } = require('../errors');

class AuthController {
    async registration(req, res, next) {
        try {
            const {email, password, name} = req.body;
            const userData = await authService.registration(email, password, name);

            res
                .status(statusCodes.CREATED)
                .cookie('refreshToken', userData.refreshToken, {maxAge: times.DAYS_30_MILLISECONDS, httpOnly: true})
                .json(userData);
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const userData = await authService.logIn(req.body);

            res
                .status(statusCodes.OK)
                .cookie('refreshToken', userData.refreshToken, {maxAge: times.DAYS_30_MILLISECONDS, httpOnly: true})
                .json(userData);
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            await Token.findOneAndDelete({ refreshToken });

            res
                .clearCookie('refreshToken')
                .status(statusCodes.OK)
                .end();
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const { link } = req.params;

            await authService.activate(link);

            res.redirect(config.CLIENT_URL);
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            const userData = authService.refresh(refreshToken);

            res
                .status(statusCodes.OK)
                .cookie('refreshToken', userData.refreshToken, {maxAge: times.DAYS_30_MILLISECONDS, httpOnly: true})
                .json(userData);

        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await authService.getAllUsers();

            res
                .status(statusCodes.OK)
                .json(users);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AuthController();