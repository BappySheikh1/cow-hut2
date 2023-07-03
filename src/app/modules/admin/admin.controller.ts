import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import { ILoginUserResponse, IRefreshTokenResponse } from "../auth/auth.interface";
import config from "../../../config";

const createAdmin = catchAsync(
    async (req:Request,res: Response)=>{
    
        const {...AdminData} = req.body
        const result = await AdminService.createAdmin(AdminData)

        sendResponse(res,{
            statusCode: httpStatus.OK,
            success : true,
            message : "Admin created successfully",
            data : result
        })
    }
)

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await AdminService.loginUser(loginData);
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
      message: 'Admin logged in successfully',
      data: others,
    });
  });
  
  const refreshToken = catchAsync(async (req: Request, res: Response) => {
   
    const { refreshToken } = req.cookies;
    const result = await AdminService.refreshToken(refreshToken);
  
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
  

export const AdminController = {
    createAdmin,
    loginUser,
    refreshToken
}