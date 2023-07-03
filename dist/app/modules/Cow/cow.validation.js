"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidation = void 0;
const zod_1 = require("zod");
const cow_constant_1 = require("./cow.constant");
const createCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        age: zod_1.z.string({
            required_error: 'age is required',
        }),
        price: zod_1.z.string({
            required_error: 'price is required',
        }),
        location: zod_1.z.enum([...cow_constant_1.CowLocations], {
            required_error: 'location is required',
        }),
        breed: zod_1.z.enum([...cow_constant_1.CowBreed], {
            required_error: 'breed is required',
        }),
        weight: zod_1.z.string({
            required_error: 'weight is required',
        }),
        label: zod_1.z.enum([...cow_constant_1.CowLevel], {
            required_error: 'label is required',
        }),
        category: zod_1.z.enum([...cow_constant_1.CowCategories], {
            required_error: 'category is required',
        }),
        seller: zod_1.z.string({
            required_error: 'seller is required',
        }),
    }),
});
exports.CowValidation = {
    createCowZodSchema,
};
