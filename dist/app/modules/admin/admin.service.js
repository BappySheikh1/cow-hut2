"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const admin_model_1 = require("./admin.model");
const jwt_helpers_1 = require("../../../helper/jwt.helpers");
const config_1 = __importDefault(require("../../../config"));
const createAdmin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    const newAdmin = admin_model_1.Admin.create(admin);
    if (!newAdmin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
    }
    return newAdmin;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    // check user exist
    const isAdminExist = yield admin_model_1.Admin.isAdminExist(phoneNumber);
    if (!isAdminExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin does not exist');
    }
    //  password match
    if (isAdminExist.password &&
        !(yield admin_model_1.Admin.isPasswordMatched(password, isAdminExist === null || isAdminExist === void 0 ? void 0 : isAdminExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is do not match');
    }
    // create access token
    const { _id: userId, role } = isAdminExist;
    const accessToken = jwt_helpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwt_helpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifyToken = null;
    try {
        verifyToken = jwt_helpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh token');
    }
    // delete by user but refresh token exist or delete checking
    const { userId } = verifyToken;
    const isAdminExist = yield admin_model_1.Admin.isAdminExistById(userId);
    if (!isAdminExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin does not exist');
    }
    // generate new token
    const newAccessToken = jwt_helpers_1.jwtHelpers.createToken({
        userId: isAdminExist._id,
        role: isAdminExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AdminService = {
    createAdmin,
    loginUser,
    refreshToken,
};
