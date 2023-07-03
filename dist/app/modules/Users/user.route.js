"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// user profile route
router.get('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), user_controller_1.UserController.getProfile);
router.patch('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), user_controller_1.UserController.updateMyProfile);
// 
router
    .post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), (0, validationRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createUser)
    .get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getSingleUsers)
    .get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers)
    .patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.updateUsers)
    .delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.deleteUsers);
exports.UserRoutes = router;
