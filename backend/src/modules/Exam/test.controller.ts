import type { Request, Response } from "express";
import * as TestService from "./test.service.js";
import type { AuthRequest } from "../../middlewares/authMiddlewares.js";
import type { AsyncRequestHandler, AuthenticatedRequestWithBody } from "../../types/express.js";
import type { UserPayload } from "../../types/express.js";
import type { CreateTestBody } from "../../constants/roles.js";
import { Types } from "mongoose";
import { respondWithError } from "../../utils/errorResponse.js";

export const createTest = async (req: AuthenticatedRequestWithBody<CreateTestBody, UserPayload>, res: Response) => {
  try {
    const { title, description, classId, duration } = req.body;

    const test = await TestService.createTest(
      title,
      description,
      classId,
      duration,
      req.user!.userId
    );

    res.status(201).json(test);
  } catch (error: unknown) {
    return respondWithError(res, error, "Creating test failed");
  }
};

export const publishTest = async (req: AuthRequest<{ testId: string }>, res: Response) => {
  try {
    const { testId } = req.params;

    const test = await TestService.publishTest(testId, req.user!.userId);

    res.json(test);
  } catch (error: unknown) {
    return respondWithError(res, error, "Publishing test failed");
  }
};

export const getTestByClassId = async (req: AuthRequest<{ classId: string }>, res: Response) => {
  try {
    const { classId } = req.params;

    const tests = await TestService.getTestByClassId(
      classId,
      req.user!.userId,
      req.user!.role,
    );
    res.json(tests);
  } catch (error: unknown) {
    return respondWithError(res, error, "Fetching class tests failed");
  }
};

export const getTestListByRole = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Controller - Fetching test list for user:", req.user);
    const tests = await TestService.getTestListByRole(req.user!.userId, req.user!.role);
    res.json(tests);
  } catch (error: unknown) {
    return respondWithError(res, error, "Fetching test list failed");
  }
};

export const getBasicInfoByTestId = async (req: AuthRequest<{ testId: string }>, res: Response) => {
  try {
    const { testId } = req.params;
    const userId = new Types.ObjectId(req.user!.userId);
    const testInfo = await TestService.getBasicInfoByTestId(testId, userId, req.user!.role);
    res.json(testInfo);
  } catch (error: unknown) {
    return respondWithError(res, error, "Fetching test details failed");
  }
};
