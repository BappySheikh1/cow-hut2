/* eslint-disable @typescript-eslint/no-this-alias */
import { ObjectId, Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['seller', 'buyer'],
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// static methods
userSchema.statics.isUserExistById = async function (
  userId: ObjectId
): Promise<Pick<IUser,  '_id' | 'role'> | null> {
  return await User.findOne({ _id: userId });
};

userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, '_id' | 'phoneNumber' | 'password' | 'role'> | null> {
  return await User.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1 ,_id:1}
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// password hashing by bcrypt
userSchema.pre('save', async function (next) {
//   // hashing user password
if (!this.isModified('password')) {
  return next();
}
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// userSchema.pre('save', async function (next) {
//   // Only hash the password if it is modified or newly created
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const saltRounds = Number(config.bcrypt_salt_rounds);
//     const hashedPassword = await bcrypt.hash(this.password, saltRounds);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });



export const User = model<IUser, UserModel>('User', userSchema);
