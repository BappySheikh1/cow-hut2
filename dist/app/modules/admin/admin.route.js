"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const admin_validation_1 = require("./admin.validation");
const auth_validation_1 = require("../auth/auth.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/create-admin', (0, validationRequest_1.default)(admin_validation_1.AdminValidation.createAdminZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.createAdmin);
router.post('/login', (0, validationRequest_1.default)(auth_validation_1.AuthValidation.loginZodSchema), admin_controller_1.AdminController.loginUser);
router.post('/refresh-token', (0, validationRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), admin_controller_1.AdminController.refreshToken);
exports.AdminRoute = router;
