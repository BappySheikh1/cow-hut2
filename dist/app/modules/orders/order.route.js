"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const order_validation_1 = require("./order.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router
    .post('/', (0, validationRequest_1.default)(order_validation_1.OrderValidation.createOrderZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER), order_controller_1.OrderController.createOrder)
    .get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN), order_controller_1.OrderController.getAllOrder)
    .get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN), order_controller_1.OrderController.getSingleOrder);
exports.OrderRoutes = router;
