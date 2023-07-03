import express from 'express';
import { AdminController } from './admin.controller';
import validationRequest from '../../middleware/validationRequest';
import { AdminValidation } from './admin.validation';
import { AuthValidation } from '../auth/auth.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-admin',
  validationRequest(AdminValidation.createAdminZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.createAdmin
);

router.post(
  '/login',
  validationRequest(AuthValidation.loginZodSchema),
  AdminController.loginUser
);

router.post(
  '/refresh-token',
  validationRequest(AuthValidation.refreshTokenZodSchema),
  AdminController.refreshToken
);

export const AdminRoute = router;
