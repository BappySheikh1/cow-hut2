import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ICow } from './cow.interface';
import httpStatus from 'http-status';
import { CowService } from './cow.Service';
import { CowsFilterableFields } from './cow.constant';
import { paginationField } from '../../../constants/paginationConstant';
import pick from '../../../shared/pick';

const createCow = catchAsync(async (req: Request, res: Response) => {
  const cowData = req.body;
  const result = await CowService.createCow(cowData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow create Successfully',
    data: result,
  });
});

const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CowsFilterableFields);
  const paginationOptions = pick(req.query, paginationField);
  const result = await CowService.getAllCow(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved Successfully',
    data: result,
  });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const userSeller = req.user?.userId;
  const result = await CowService.updateCow(id, updatedData, userSeller);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated Successfully',
    data: result,
  });
});
const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userSeller = req.user?.userId;
  const result = await CowService.deleteCow(id, userSeller);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted Successfully',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCow,
  getSingleCow,
  updateCow,
  deleteCow,
};
