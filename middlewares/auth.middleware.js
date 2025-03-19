const BaseError = require("../errors/base.error");
const tokenService = require("../service/token.service");

module.exports = function (req, _, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth) { return next(BaseError.UnauthorizedError()); };
        const accessToken = auth.split(" ")[1];
        if (!accessToken) { return next(BaseError.TokenNotFound()); };
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) { return next(BaseError.TokenNotFound()); };
        req.user = userData;
        next();
    } catch (error) {
        next(BaseError.UnauthorizedError());
    };
};