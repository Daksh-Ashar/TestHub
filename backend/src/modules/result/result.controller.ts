import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/authMiddlewares.js";
import * as ResultService from "./result.service.js";
import { respondWithError } from "../../utils/errorResponse.js";

export const getTestResultsForCreator = async (req: AuthRequest<{testId: string}>, res: Response) => {
  try {
    const { testId } = req.params;

    const results = await ResultService.getTestResultsForCreator(
      testId,
      req.user!.userId
    );

    res.json(results);
  } catch (error: unknown) {
    return respondWithError(res, error, "Fetching test results failed");
  }
};

export const getParticipantResults = async (req: AuthRequest, res: Response) => {
  try {
    const results = await ResultService.getParticipantResults(req.user!.userId);
    res.json(results);
  } catch (error: unknown) {
    return respondWithError(res, error, "Fetching participant results failed");
  }
};
