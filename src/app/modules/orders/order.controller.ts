import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OrderService } from './order.service';
import sendResponse from '../../../shared/sendResponse';
import { IOrders } from './order.interface';
import httpStatus from 'http-status';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body;
  const result = await OrderService.createOrder(orderData);

  sendResponse<IOrders>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'order created successfully',
    data: result,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = req.user as { userId: string; role: string };
  const result = await OrderService.getAllOrder(userId, role);

  sendResponse<IOrders[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'orders retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId,role } = req.user as { userId: string; role: string };
  const { id } = req.params;
  const result = await OrderService.getSingleOrder(id,role,userId);

  sendResponse<IOrders>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'orders retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrder,
  getSingleOrder,
};
