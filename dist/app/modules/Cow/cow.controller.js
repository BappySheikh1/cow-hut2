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
exports.CowController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const cow_Service_1 = require("./cow.Service");
const cow_constant_1 = require("./cow.constant");
const paginationConstant_1 = require("../../../constants/paginationConstant");
const pick_1 = __importDefault(require("../../../shared/pick"));
const createCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cowData = req.body;
    const result = yield cow_Service_1.CowService.createCow(cowData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cow create Successfully',
        data: result,
    });
}));
const getAllCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, cow_constant_1.CowsFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, paginationConstant_1.paginationField);
    const result = yield cow_Service_1.CowService.getAllCow(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cows retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield cow_Service_1.CowService.getSingleCow(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cow retrieved Successfully',
        data: result,
    });
}));
const updateCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const updatedData = req.body;
    const userSeller = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield cow_Service_1.CowService.updateCow(id, updatedData, userSeller);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cow updated Successfully',
        data: result,
    });
}));
const deleteCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    const userSeller = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const result = yield cow_Service_1.CowService.deleteCow(id, userSeller);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cow deleted Successfully',
        data: result,
    });
}));
exports.CowController = {
    createCow,
    getAllCow,
    getSingleCow,
    updateCow,
    deleteCow,
};
