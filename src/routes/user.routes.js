const express = require('express');
const { userController } = require('../controllers');

const userRoutes = express.Router({});

userRoutes.get('/', userController.getList);
userRoutes.post('/', userController.addOne);
userRoutes.get('/count', userController.getListCount);
userRoutes.get('/:userId/', userController.getOne);
userRoutes.put('/:userId/', userController.updateOne);
userRoutes.delete('/:userId/', userController.deleteOne);

module.exports = userRoutes;
