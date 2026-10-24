import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Role } from "../constants/roles.js";

export interface AuthenticatedRequestWithBody<B, U = any> extends Request {
  body: B;
  user: U;
}



export interface UserPayload {
  userId: string;
  role: Role; // or ROLES enum
}


export type AsyncRequestHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<any>;



export const wrapAsync = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => (req, res, next) => fn(req as T, res, next).catch(next);
