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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const user_model_1 = require("../Users/user.model");
const jwt_helpers_1 = require("../../../helper/jwt.helpers");
const config_1 = __importDefault(require("../../../config"));
// const createUser = async (
//   user: IUser
// ): Promise<IUser | null> => {
//   if(user.role === 'seller' && (user.budget !== 0 || user.income !== 0)){
//       throw new ApiError(httpStatus.BAD_REQUEST, "seller can't set initially budget and income")
//     }
//     if(user.role === 'buyer' && (user.income !== 0 || user.budget <= 0)){
//       throw new ApiError(httpStatus.BAD_REQUEST, "buyer set budget value but can't set initially income value")
//     }
//   const result = await User.create(user)
//   return result
// }
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    if (!user.password) {
        user.password = config_1.default.default_user_pass;
    }
    if (user.role === 'seller') {
        const dafolt = 0;
        user.budget = dafolt;
        user.income = dafolt;
    }
    const result = yield user_model_1.User.create(user);
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    // check user exist
    const isUserExist = yield user_model_1.User.isUserExist(phoneNumber);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //  password match
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatched(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is do not match');
    }
    // create access token
    const { _id: userId, role } = isUserExist;
    const accessToken = jwt_helpers_1.jwtHelpers.createToken({ userId, role, }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
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
    const isUserExist = yield user_model_1.User.isUserExistById(userId);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // generate new token
    const newAccessToken = jwt_helpers_1.jwtHelpers.createToken({
        userId: isUserExist._id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AuthService = {
    loginUser,
    refreshToken,
    createUser
};
