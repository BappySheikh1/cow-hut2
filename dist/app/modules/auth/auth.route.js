"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const auth_validation_1 = require("./auth.validation");
const user_validation_1 = require("../Users/user.validation");
const router = express_1.default.Router();
router.post('/signup', (0, validationRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), auth_controller_1.AuthController.createUser);
router.post('/login', (0, validationRequest_1.default)(auth_validation_1.AuthValidation.loginZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', (0, validationRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
exports.AuthRoutes = router;
