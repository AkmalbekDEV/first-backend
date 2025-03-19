const UserDto = require('../dtos/user.dto');
const BaseError = require('../errors/base.error');
const authService = require('../service/auth.service');
const { validationResult } = require('express-validator');

class AuthController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return next(BaseError.BadRequest("Validation error", errors.array())) };
            const { email, password } = req.body;
            const data = await authService.register(email, password, req.files.picture);
            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return res.json(data);
        } catch (error) {
            next(error);
        };
    };

    async activate(req, res, next) {
        try {
            const userId = req.params.id;
            await authService.activate(userId);
            return res.redirect('https://sammi.ac');
        } catch (error) {
            next(error);
        };
    };

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const data = await authService.login(email, password);
            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return res.json(data);
        } catch (error) {
            next(error);
        };
    };

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json({ token });
        } catch (error) {
            next(error);
        };
    };

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const data = await authService.refresh(refreshToken);
            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return res.json(data);
        } catch (error) {
            next(error);
        };
    };

    async getAll(_, res, next) {
        try {
            const users = await authService.getAll();
            const userDtos = users.map(user => {
                const dto = new UserDto(user);
                return dto;
            });
            res.status(200).json(userDtos);
        } catch (error) {
            next(error);
        };
    };
};

module.exports = new AuthController();