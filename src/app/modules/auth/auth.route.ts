import express from 'express';
import { AuthController } from './auth.controller';
import validationRequest from '../../middleware/validationRequest';
import { AuthValidation } from './auth.validation';
import { UserValidation } from '../Users/user.validation';
const router = express.Router();


router.post(
  '/signup',
  validationRequest(UserValidation.createUserZodSchema),
  AuthController.createUser
);
router.post(
  '/login',
  validationRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);
router.post(
  '/refresh-token',
  validationRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
