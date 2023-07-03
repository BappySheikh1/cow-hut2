"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.object({
            firstName: zod_1.z.string({
                required_error: 'First name is required',
            }),
            lastName: zod_1.z.string({
                required_error: 'Last name is required',
            })
        }),
        password: zod_1.z.string({
            required_error: 'password is required',
        }),
        role: zod_1.z.enum(['buyer', 'seller'], {
            required_error: 'role is required',
        }),
        phoneNumber: zod_1.z.string({
            required_error: 'phoneNumber is required',
        }),
        address: zod_1.z.string({
            required_error: 'address is required',
        }),
        budget: zod_1.z.string({
            required_error: 'budget is required',
        }),
        income: zod_1.z.string({
            required_error: 'income is required',
        }),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
};
