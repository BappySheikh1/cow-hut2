/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';

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
const createUser = async (user: IUser): Promise<IUser> => {
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }
  if (user.role === 'seller') {
    const dafolt = 0;
    user.budget = dafolt;
    user.income = dafolt;
  }
  const result = await User.create(user);
  return result;
};
const getAllUsers = async (): Promise<IUser[] | null> => {
  const result = await User.find({});
  return result;
};

const getSingleUsers = async (id: string): Promise<IUser | null> => {
  const result = await User.findById({ _id: id });
  return result;
};

const updateUsers = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const deleteUsers = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id, { new: true });
  return result;
};

// user profile
const getProfile = async (
  userId: string,
  role: string
): Promise<IUser | null> => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role !== role && role !== 'admin') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  return user;
};

const updateMyProfile = async (
  userId: ObjectId,
  payload: IUser
): Promise<Partial<IUser | null>> => {
  const isExist = await User.findOne({ _id: userId });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { name, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  // dynamic updated
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  // password hashing
  if (userData.password) {
    const hashPassword = await bcrypt.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds)
    );
    updatedUserData.password = hashPassword;
  }
  //  find
  const result = await User.findOneAndUpdate(
    { _id: userId },
    updatedUserData,

    { _id: 0, name: 1, phoneNumber: 1, address: 1 }
  );

  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUsers,
  updateUsers,
  deleteUsers,
  getProfile,
  updateMyProfile,
};
