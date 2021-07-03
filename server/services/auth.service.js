const { models: { User } } = require('../database');
const { config } = require('../constants');
const mailService = require('./mail.service');
const tokenService = require('./token.service');
const { UserDto } = require('../dtos');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const {models} = require("../database");
const {ErrorHandler, errorMessages: { UNAUTHORIZED, RECORD_NOT_FOUND, WRONG_EMAIL_OR_PASSWORD }} = require("../errors");
const {statusCodes} = require("../constants");

class AuthService {
    async registration(email, password, name = '') {

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await User.create({
            name, email,
            password: hashPassword,
            activationLink
        });

        const link = `${config.API_URL}/auth/activate/${activationLink}`;
        await mailService.sendActivationMail(email, link);

        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return  { ...tokens, user: userDto };
    }

    async activate(activationLink) {
        const user = await models.User.findOne({ activationLink });

        if (!user) {
            throw new ErrorHandler(
                statusCodes.NOT_FOUND,
                RECORD_NOT_FOUND.message,
                RECORD_NOT_FOUND.code
            );
        }

        user.isActivated = true;

        await user.save();
    }

    async logIn({ email, password }) {
        const user = await models.User.findOne({ email });

        if (!user) {
            _wrongEmailOrPassword();
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            _wrongEmailOrPassword();
        }

        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return  { ...tokens, user: userDto };

    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);

        const tokenFromDB = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDB){
            throw new ErrorHandler(
                statusCodes.UNAUTHORIZED,
                UNAUTHORIZED.message,
                UNAUTHORIZED.code
            )
        }

        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return  { ...tokens, user: userDto };
    }

    async getAllUsers() {
        return await User.find({});
    }
}

module.exports = new AuthService();

function _wrongEmailOrPassword() {
    throw new ErrorHandler(
        statusCodes.BAD_REQUEST,
        WRONG_EMAIL_OR_PASSWORD.message,
        WRONG_EMAIL_OR_PASSWORD.code
    );
}