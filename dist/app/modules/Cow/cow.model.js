"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cow = void 0;
const mongoose_1 = require("mongoose");
const cow_constant_1 = require("./cow.constant");
const cowSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    location: {
        type: String,
        enum: cow_constant_1.CowLocations,
        required: true
    },
    breed: {
        type: String,
        enum: cow_constant_1.CowBreed,
        required: true
    },
    weight: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        enum: cow_constant_1.CowLevel,
        required: true,
        default: "for sale"
    },
    category: {
        type: String,
        enum: cow_constant_1.CowCategories,
        required: true
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});
// pre hook
// cowSchema.pre('save', async function (next) {
//     const isExist = await Cow.findOne({
//         category: this.category,
//         breed: this.breed,
//     });
//     if (isExist) {
//       throw new ApiError(httpStatus.CONFLICT, 'This Cow is already exist !');
//     }
//     next();
//   });
exports.Cow = (0, mongoose_1.model)('Cow', cowSchema);
