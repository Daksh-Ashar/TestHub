import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/authMiddlewares.js";
import * as ResultService from "./result.service.js";

export const getTestResultsForCreator = async (req: AuthRequest<{testId: string}>, res: Response) => {
  try {
    const { testId } = req.params;

    const results = await ResultService.getTestResultsForCreator(
      testId,
      req.user!.userId
    );

    res.json(results);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getParticipantResults = async (req: AuthRequest, res: Response) => {
  try {
    const results = await ResultService.getParticipantResults(req.user!.userId);
    res.json(results);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
