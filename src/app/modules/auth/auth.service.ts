import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { User } from '../Users/user.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { jwtHelpers } from '../../../helper/jwt.helpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { IUser } from '../Users/user.interface';

// const createUser = async (
//   user: IUser
// ): Promise<IUser | null> => {

//   if(user.role === 'seller' && (user.budget !== 0 || user.income !== 0)){
//       throw new ApiError(httpStatus.BAD_REQUEST, "seller can't set initially budget and income")
//     }
  
//     if(user.role === 'buyer' && (user.income !== 0 || user.budget <= 0)){
//       throw new ApiError(httpStatus.BAD_REQUEST, "buyer set budget value but can't set initially income value")
//     }
  
//   const result = await User.create(user)
//   return result
// }

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

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;
  // check user exist
  const isUserExist = await User.isUserExist(phoneNumber);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //  password match
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is do not match');
  }

  // create access token
  const { _id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    {  userId, role , },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifyToken = null;
  try {
    verifyToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh token');
  }

 // delete by user but refresh token exist or delete checking
  const { userId } = verifyToken;

  const isUserExist = await User.isUserExistById(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  createUser
};
