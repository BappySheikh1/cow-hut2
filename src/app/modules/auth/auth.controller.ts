import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';
import { IUser } from '../Users/user.interface';

const createUser = catchAsync(
  async (req: Request, res: Response) => {
      const userData = req.body;
      const result = await AuthService.createUser(userData)

      sendResponse<IUser>(res,{
          statusCode: httpStatus.OK,
          success : true,
          message : "User created successfully",
          data : result
      })
  }
)


const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;
 
  // set refreshToken info
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  // set refreshToken info
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  createUser
};
