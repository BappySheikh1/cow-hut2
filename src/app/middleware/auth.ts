import { NextFunction, Request, Response } from "express";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helper/jwt.helpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      // console.log(token, "User's token");
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; // role , userId
      console.log(req.user, "request user");


      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      next();
      
    } catch (error) {
      next(error);
    }
  };

export default auth;