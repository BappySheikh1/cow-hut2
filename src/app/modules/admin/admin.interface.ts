/* eslint-disable no-unused-vars */
import { Model, ObjectId } from 'mongoose';

export type IAdmin = {
  _id: ObjectId;
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  budget: number;
  income: number;
};

export type AdminModel = {
  isAdminExistById(pho: string): Promise<Pick<IAdmin, '_id' | 'role'> | null>;

  isAdminExist(
    pho: string
  ): Promise<Pick<IAdmin, '_id' | 'phoneNumber' | 'password' | 'role'>>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;

// export type AdminModel = Model<IAdmin, Record<string,unknown>>

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
