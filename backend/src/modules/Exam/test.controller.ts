import type { Request, Response } from "express";
import * as TestService from "./test.service.js";
import type { AuthRequest } from "../../middlewares/authMiddlewares.js";
import type { AsyncRequestHandler, AuthenticatedRequestWithBody } from "../../types/express.js";
import type { UserPayload } from "../../types/express.js";
import type { CreateTestBody } from "../../constants/roles.js";
import { Types } from "mongoose";

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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const publishTest = async (req: AuthRequest<{ testId: string }>, res: Response) => {
  try {
    const { testId } = req.params;

    const test = await TestService.publishTest(testId, req.user!.userId);

    res.json(test);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTestByClassId = async (req: AuthRequest<{ classId: string }>, res: Response) => {
  try {
    const { classId } = req.params;

    const tests = await TestService.getTestByClassId(classId);
    res.json(tests);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTestListByRole = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Controller - Fetching test list for user:", req.user);
    const tests = await TestService.getTestListByRole(req.user!.userId, req.user!.role);
    res.json(tests);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBasicInfoByTestId = async (req: AuthRequest<{ testId: string }>, res: Response) => {
  try {
    const { testId } = req.params;
    const userId = new Types.ObjectId(req.user!.userId);
    const testInfo = await TestService.getBasicInfoByTestId(testId, userId, req.user!.role);
    res.json(testInfo);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

