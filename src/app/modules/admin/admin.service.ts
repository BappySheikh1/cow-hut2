import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { IAdmin, ILoginAdmin, ILoginAdminResponse, IRefreshTokenResponse } from './admin.interface';
import { Admin } from './admin.model';
import { jwtHelpers } from '../../../helper/jwt.helpers';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  const newAdmin = Admin.create(admin);

  if (!newAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
  }

  return newAdmin;
};

const loginUser = async (payload: ILoginAdmin): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload;
  // check user exist
  const isAdminExist = await Admin.isAdminExist(phoneNumber);
  
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }

  //  password match
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is do not match');
  }

  // create access token
  const {  _id:userId, role } = isAdminExist;
  const accessToken = jwtHelpers.createToken(
    {  userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {  userId, role },
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
  
  const isAdminExist = await Admin.isAdminExistById(userId);
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isAdminExist._id,
      role: isAdminExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AdminService = {
  createAdmin,
  loginUser,
  refreshToken,
};
