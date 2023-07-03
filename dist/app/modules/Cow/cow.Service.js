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
exports.CowService = void 0;
const paginationHelper_1 = require("../../../helper/paginationHelper");
const cow_constant_1 = require("./cow.constant");
const cow_model_1 = require("./cow.model");
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createCow = (cow) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.create(cow);
    return result;
});
const getAllCow = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // filter start
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constant_1.CowsSearchableFields.map(fields => ({
                [fields]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    //  Exact match
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    //  filter end
    //pagination start
    const { limit, page, skip, sortBy, sortOrder, minPrice, maxPrice } = paginationHelper_1.PaginationHelper.calculatePagination(paginationOptions);
    if (minPrice !== 0 && maxPrice !== 0) {
        andConditions.push({
            $and: [
                {
                    price: {
                        $gte: minPrice,
                        $lte: maxPrice,
                    },
                },
            ],
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // pagination end
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.Cow.find(whereConditions)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments(whereConditions);
    return {
        meta: {
            limit,
            page,
            total,
        },
        data: result,
    };
});
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById({ _id: id }).populate('seller');
    return result;
});
const updateCow = (id, cow, userSeller) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerData = yield cow_model_1.Cow.findById(id);
    if ((sellerData === null || sellerData === void 0 ? void 0 : sellerData.seller.toString()) !== userSeller) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Access denied. you are not this seller this cow');
    }
    const result = yield cow_model_1.Cow.findByIdAndUpdate(id, cow, { new: true }).populate('seller');
    return result;
});
const deleteCow = (id, userSeller) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerData = yield cow_model_1.Cow.findById(id);
    if ((sellerData === null || sellerData === void 0 ? void 0 : sellerData.seller.toString()) !== userSeller) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Access denied. you are not this seller this cow');
    }
    const result = yield cow_model_1.Cow.findByIdAndDelete({ _id: id }).populate('seller');
    return result;
});
exports.CowService = {
    createCow,
    getAllCow,
    getSingleCow,
    updateCow,
    deleteCow,
};
