const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token.model');
const accessKey = process.env.JWT_ACCESS_KEY;
const refreshKey = process.env.JWT_REFRESH_KEY;

class PostService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, accessKey, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, refreshKey, { expiresIn: "30d" });
        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const existToken = await tokenModel.findOne({ user: userId });
        if (existToken) { existToken.refreshToken = refreshToken; return existToken.save(); };
        const token = await tokenModel.create({ user: userId, refreshToken });
        return token;
    };

    async removeToken(refreshToken) {
        return await tokenModel.findOneAndDelete({ refreshToken });
    };

    async findToken(refreshToken) {
        return await tokenModel.findOne({ refreshToken });
    };

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, refreshKey);
        } catch (error) {
            return false;
        };
    };

    validateAccessToken(token) {
        try {
            return jwt.verify(token, accessKey);
        } catch (error) {
            return false;
        };
    };
};

module.exports = new PostService();