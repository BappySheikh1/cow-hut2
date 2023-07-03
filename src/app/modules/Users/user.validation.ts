import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      })
    }),
    password: z.string({
      required_error: 'password is required',
    }),
    role: z.enum(['buyer', 'seller'] as [string, ...string[]], {
      required_error: 'role is required',
    }),

    phoneNumber: z.string({
      required_error: 'phoneNumber is required',
    }),
    address: z.string({
      required_error: 'address is required',
    }),

    budget: z.string({
      required_error: 'budget is required',
    }),
    income: z.string({
      required_error: 'income is required',
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
