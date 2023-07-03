import express from 'express';
import { CowController } from './cow.controller';
import validationRequest from '../../middleware/validationRequest';
import { CowValidation } from './cow.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router
  .post(
    '/',
    validationRequest(CowValidation.createCowZodSchema),
    auth(ENUM_USER_ROLE.SELLER),
    CowController.createCow
  )
  .get(
    '/:id',
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
    CowController.getSingleCow
  )
  .get(
    '/',
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
    CowController.getAllCow
  )
  .patch('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.updateCow)
  .delete('/:id',auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);

export const CowRoutes = router;
