import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'phoneNumber is required',
    }),
    role: z.enum(['admin'] as [string, ...string[]], {
      required_error: 'role is required',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    address: z.string({
      required_error: 'address is required',
    }),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
};
