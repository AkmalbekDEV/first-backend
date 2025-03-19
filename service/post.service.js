const postModel = require("../models/post.model");
const fileService = require("./file.service");

class PostService {
    async create(post, picture) {
        const fileName = fileService.save(picture);
        const newPost = await postModel.create({ ...post, picture: fileName });
        return newPost;
    };

    async getAll() {
        const allPosts = await postModel.find();
        return allPosts;
    };

    async delete(id) {
        const post = await postModel.findById(id);
        fileService.delete(post.picture);
        const deletePost = await postModel.findByIdAndDelete(id);
        return deletePost;
    };

    async update(post, id) {
        if (!id) { throw new Error("ID not found!"); };
        const updatedData = await postModel.findByIdAndUpdate(id, post, { new: true });
        return updatedData;
    };

    async getById(id) {
        if (!id) { throw new Error("ID not found!"); };
        const post = await postModel.findById(id);
        return post;
    };
};

module.exports = new PostService();