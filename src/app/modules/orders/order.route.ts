import express from 'express';
import { OrderController } from './order.controller';
import validationRequest from '../../middleware/validationRequest';
import { OrderValidation } from './order.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router
  .post(
    '/',
    validationRequest(OrderValidation.createOrderZodSchema),
    auth(ENUM_USER_ROLE.BUYER),
    OrderController.createOrder
  )
  .get(
    '/',
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
    OrderController.getAllOrder
  )
  .get(
    '/:id',
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
    OrderController.getSingleOrder
  );

export const OrderRoutes = router;
