/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, ObjectId } from 'mongoose';

export type IUser = {
  _id: ObjectId;
  phoneNumber: string;
  role: 'seller' | 'buyer';
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  budget: number;
  income: number;
};

export type UserModel = {
  isUserExistById(pho: string): Promise<Pick<IUser, '_id' | 'role'> | null>;
  
  isUserExist(
    pho: string
  ): Promise<Pick<IUser, '_id' | 'phoneNumber' | 'password' | 'role'> | null>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
