import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { UserService } from './user.Service';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';

const createUser = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.cookies);
  const userData = req.body;
  const result = await UserService.createUser(userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.headers.authorization, "authorization");
  const result = await UserService.getAllUsers();

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getSingleUsers = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUsers(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUsers = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await UserService.updateUsers(id, updatedData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUsers = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUsers(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  });
});

// user profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
    console.log(req.user, "request user");
    const {userId, role} =req.user as {userId: string; role: string}

    const result = await UserService.getProfile(userId, role);
    
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      data: result,
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    console.log(req.user, "request user");
    const {userId} =req.user as {userId: ObjectId ;}
    const updatedData =req.body
    const result = await UserService.updateMyProfile(userId,updatedData);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      data: result,
    });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUsers,
  updateUsers,
  deleteUsers,
  getProfile,
  updateMyProfile
};
