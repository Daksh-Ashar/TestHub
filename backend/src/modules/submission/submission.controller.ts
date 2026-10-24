import type { Response } from "express";
import * as SubmissionService from "./submission.service.js";
import type { UserPayload } from "../../types/express.js";
import type { AuthenticatedRequestWithBody } from "../../types/express.js";
import type { SubmitTestBody } from "../../constants/roles.js";

export const submitTest = async (req: AuthenticatedRequestWithBody<SubmitTestBody, UserPayload>, res: Response) => {
  try {
    const { testId, answers } = req.body;

    const submission = await SubmissionService.submitTest(
      testId,
      req.user!.userId,
      answers
    );

    res.status(201).json(submission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
