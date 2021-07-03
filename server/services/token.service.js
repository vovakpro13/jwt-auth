const jwt = require('jsonwebtoken');
const { config } = require('../constants');
const { models: { Token } } = require('../database');

class TokenService{
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    async validateAccessToken(token) {
        try {
            return jwt.verify(token, config.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }

    }

    async validateRefreshToken(token) {
        try {
            return  jwt.verify(token, config.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return await Token.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.deleteOne({ refreshToken });

        return tokenData;
    }

    async findToken(refreshToken) {
        return await Token.findOne({ refreshToken });
    }
}

module.exports = new TokenService();