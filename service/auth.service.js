const UserDto = require("../dtos/user.dto");
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const tokenService = require("./token.service");
const mailService = require("./mail.service");
const BaseError = require("../errors/base.error");
const fileService = require("./file.service");

class AuthService {
    async register(email, password, picture) {
        const existUser = await userModel.findOne({ email });
        if (existUser) { throw BaseError.BadRequest("A user with this email already created!") };
        const fileName = fileService.save(picture);
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ email, password: hashPassword, picture: fileName });
        const userDto = new UserDto(user);
        await mailService.sendMail(email, `${process.env.API_URL}/api/user/activate/${userDto.id}`);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { user: userDto, ...tokens };
    };

    async activate(id) {
        const user = await userModel.findById(id);
        if (!user) { throw BaseError.UnauthorizedError("User not found!") };
        user.isActivated = true;
        await user.save();
    };

    async login(email, password) {
        const user = await userModel.findOne({ email });
        if (!user) { throw BaseError.UnauthorizedError("User not found!") };
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) { throw BaseError.BadRequest("Password is incorrect!") };
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { user: userDto, ...tokens };
    };

    async logout(token) {
        return await tokenService.removeToken(token);
    };

    async refresh(token) {
        if (!token) { throw BaseError.UnauthorizedError('Bad authorization!') };
        const userPayload = tokenService.validateRefreshToken(token);
        const tokenDb = await tokenService.findToken(token);
        if (!userPayload || !tokenDb) { throw BaseError.UnauthorizedError('Bad authorization!') };
        const user = await userModel.findById(userPayload.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { user: userDto, ...tokens };
    };

    async getAll() {
        const users = await userModel.find();
        return users;
    };
};

module.exports = new AuthService();