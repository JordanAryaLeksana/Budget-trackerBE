const express = require('express');
const UserController = require('./user.controller');
const router = express.Router();
const {
idParamValidator,
createUserValidator,
updateUserValidator,

} = require('./user.validator'); 

const validateRequest = require('../../middlewares/validation.middleware');
const asyncErrorHandler= require('../../errors/asyncErrorHandler');
const authJWT = require('../../middlewares/auth.middleware');

router.use(authJWT)
router.get('/', asyncErrorHandler(UserController.getAll.bind(UserController)));
router.get('/:id',idParamValidator,validateRequest, asyncErrorHandler(UserController.getById.bind(UserController)))
router.post('/', createUserValidator,validateRequest, asyncErrorHandler(UserController.create.bind(UserController)));
router.put('/:id', idParamValidator,updateUserValidator, validateRequest,  asyncErrorHandler(UserController.update.bind(UserController)));
router.delete('/:id',idParamValidator,validateRequest, asyncErrorHandler(UserController.delete.bind(UserController)));

module.exports = router;