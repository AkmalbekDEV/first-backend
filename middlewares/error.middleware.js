const BaseError = require("../errors/base.error");

module.exports = function (err, _, res, _) {
    if (err instanceof BaseError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }

    return res.status(500).json({ message: "Internal server error!" });
};