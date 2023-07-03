import express from 'express';
import { UserController } from './user.controller';
import validationRequest from '../../middleware/validationRequest';
import { UserValidation } from './user.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

  // user profile route
  router.get('/my-profile', 
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.getProfile);

  router.patch('/my-profile',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER)  
  ,UserController.updateMyProfile)

  // 
router
  .post(
    '/',
    auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.BUYER,ENUM_USER_ROLE.SELLER),
    validationRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  )
  .get('/:id', 
  auth(ENUM_USER_ROLE.ADMIN), 
  UserController.getSingleUsers)

  .get('/', 
  auth(ENUM_USER_ROLE.ADMIN), 
  UserController.getAllUsers)
  
  .patch('/:id',
   auth(ENUM_USER_ROLE.ADMIN), 
   UserController.updateUsers)
  .delete('/:id', 
  auth(ENUM_USER_ROLE.ADMIN), 
  UserController.deleteUsers);



export const UserRoutes = router;
