module.exports = class UserDto {
    id;
    email;
    password;
    picture;
    isActivated;
    createdAt;
    updatedAt;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.password = model.password;
        this.picture = model.picture;
        this.isActivated = model.isActivated;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    };
};