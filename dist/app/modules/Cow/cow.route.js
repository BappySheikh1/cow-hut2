"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cow_controller_1 = require("./cow.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const cow_validation_1 = require("./cow.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router
    .post('/', (0, validationRequest_1.default)(cow_validation_1.CowValidation.createCowZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.createCow)
    .get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN), cow_controller_1.CowController.getSingleCow)
    .get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN), cow_controller_1.CowController.getAllCow)
    .patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.updateCow)
    .delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.deleteCow);
exports.CowRoutes = router;
