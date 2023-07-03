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
exports.OrderService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("./order.model");
const cow_model_1 = require("../Cow/cow.model");
const user_model_1 = require("../Users/user.model");
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    const cow = yield cow_model_1.Cow.findById(order.cow).session(session);
    if (!cow) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Cow with ID ${order.cow} does not exist!`);
    }
    if (cow.label === 'sold out') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The product is already sold out!');
    }
    const buyer = yield user_model_1.User.findById(order.buyer).session(session);
    if (!buyer) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Buyer with ID ${order.buyer} does not exist!`);
    }
    if (Number(buyer.budget) < Number(cow.price)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient funds to buy the cow.');
    }
    const updatedBudget = Number(buyer.budget) - Number(cow.price);
    buyer.budget = updatedBudget;
    yield buyer.save();
    if (cow.seller) {
        const seller = yield user_model_1.User.findById(cow.seller).session(session);
        if (!seller) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Seller not found.');
        }
        const updatedIncome = Number(seller.income) + Number(cow.price);
        seller.income = updatedIncome;
        yield seller.save();
    }
    session.startTransaction();
    try {
        cow.label = 'sold out';
        yield cow.save();
        const orderData = {
            cow: order.cow,
            buyer: order.buyer,
        };
        const confirmOrder = yield order_model_1.Order.create([orderData], { session });
        if (!confirmOrder || confirmOrder.length === 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'confirm order not create');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return confirmOrder[0];
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getAllOrder = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(role, userId, "Admin and UserId");
    let result = [];
    // Check if the user role is 'admin'
    if (role === 'admin') {
        result = yield order_model_1.Order.find({}).populate('buyer').populate({
            path: 'cow',
            populate: 'seller',
        });
    }
    else if (role === 'buyer') {
        // Retrieve orders for the specific buyer
        result = yield order_model_1.Order.find({ buyer: userId }).populate('buyer').populate({
            path: 'cow',
            populate: 'seller',
        });
    }
    else if (role === 'seller') {
        // Retrieve orders for the specific seller
        result = yield cow_model_1.Cow.find({ seller: userId }).populate('buyer').populate({
            path: 'cow',
            populate: 'seller',
        });
    }
    return result;
});
// const getSingleOrder = async (id: string, role: string, userId: string) => {
//   // console.log( `mongodb _id ${id}`, role, `auth id ${userId}`, 'SingleOrder get');
//   let singleOrder = null;
//   if (role === 'admin') {
//     singleOrder = await Order.findById(id).populate('buyer').populate({
//       path: 'cow',
//       populate: 'seller',
//     });
//   } else if (role === 'buyer') {
//     singleOrder = await Order.findOne({ _id: id, 'buyer._id': userId })
//       .populate('buyer')
//       .populate({
//         path: 'cow',
//         populate: 'seller',
//       });
//   }
//   else if (role === 'seller') {
//     singleOrder = await Order.findOne({ _id: id, 'cow.seller._id': userId });
//   }
//   console.log(singleOrder);
//   if (!singleOrder) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
//   }
//   return singleOrder;
// };
const getSingleOrder = (id, role, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let singleOrder = null;
    if (role === 'buyer') {
        // console.log('Buyer', {'buyer._id': userId});
        const myOrder = yield order_model_1.Order.findOne({ _id: id, buyer: userId })
            .populate('buyer')
            .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        })
            .lean();
        if (myOrder) {
            singleOrder = myOrder;
        }
        else {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'This is not your order Id');
        }
    }
    else if (role === 'seller') {
        const order = yield order_model_1.Order.findOne({ _id: id })
            .populate('buyer')
            .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        })
            .lean();
        if (!order) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order not found');
        }
        const { cow } = order;
        const sellerCow = yield cow_model_1.Cow.findOne({ _id: cow }).lean();
        if (!sellerCow) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cow not found');
        }
        const { seller } = sellerCow;
        if (seller.toString() !== userId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user is no the seller. Access denied');
        }
        singleOrder = order;
    }
    else if (role === 'admin') {
        singleOrder = yield order_model_1.Order.findOne({ _id: id }).populate('buyer')
            .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        })
            .lean();
    }
    return singleOrder;
});
exports.OrderService = {
    createOrder,
    getAllOrder,
    getSingleOrder,
};
