const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/posts', authMiddleware, postController.getAll);
router.post('/post/create', postController.create);
router.delete('/post/delete/:id', postController.delete);
router.put('/post/update/:id', postController.update);
router.get('/post/getById/:id', postController.getById);

module.exports = router;