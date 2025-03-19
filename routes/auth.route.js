const express = require('express');
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/users', authMiddleware, authController.getAll);
router.post('/user/register', body('password').isLength({ min: 6, max: 30 }), authController.register);
router.get('/user/activate/:id', authController.activate);
router.post('/user/login', authController.login);
router.post('/user/logout', authController.logout);
router.get('/user/refresh', authController.refresh);

module.exports = router;