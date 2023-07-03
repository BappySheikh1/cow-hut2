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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
// const createUser = async (user: IUser): Promise<IUser | null> => {
//   if (user.role === 'seller' && (user.budget !== 0 || user.income !== 0)) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "seller can't set initially budget and income"
//     );
//   }
//   if (user.role === 'buyer' && (user.income !== 0 || user.budget <= 0)) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "buyer set budget value but can't set initially income value"
//     );
//   }
//   const userCreated = await User.create(user);
//   if (!userCreated) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
//   }
//   return userCreated;
// };
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
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({});
    return result;
});
const getSingleUsers = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById({ _id: id });
    return result;
});
const updateUsers = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteUsers = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id, { new: true });
    return result;
});
// user profile
const getProfile = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: userId });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role !== role && role !== 'admin') {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized');
    }
    return user;
});
const updateMyProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ _id: userId });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updatedUserData = Object.assign({}, userData);
    // dynamic updated
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            updatedUserData[nameKey] = name[key];
        });
    }
    // password hashing
    if (userData.password) {
        const hashPassword = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.bcrypt_salt_rounds));
        updatedUserData.password = hashPassword;
    }
    //  find
    const result = yield user_model_1.User.findOneAndUpdate({ _id: userId }, updatedUserData, { _id: 0, name: 1, phoneNumber: 1, address: 1 });
    return result;
});
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUsers,
    updateUsers,
    deleteUsers,
    getProfile,
    updateMyProfile,
};
