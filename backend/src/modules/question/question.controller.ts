import type { Response } from "express";
import * as QuestionService from "./question.service.js";
import type {  AuthenticatedRequestWithBody } from "../../types/express.js";
import type { UserPayload } from "../../types/express.js";
import type { AddQuestionBody } from "../../constants/roles.js";
import { respondWithError } from "../../utils/errorResponse.js";

export const addQuestion = async (req: AuthenticatedRequestWithBody<AddQuestionBody, UserPayload>, res: Response) => {
  try {
    const { testId, questionText, options } = req.body;
    const question = await QuestionService.addQuestion(
      testId,
      questionText,
      options,
      req.user!.userId
    );

    res.status(201).json(question);
  } catch (error: unknown) {
    return respondWithError(res, error, "Adding question failed");
  }
};

export const getQuestionsByTest = async (req: AuthenticatedRequestWithBody<{}, UserPayload>, res: Response) => {
  try {
    const { testId } = req.params;
    if (!testId || Array.isArray(testId)) {
      return res.status(400).json({ message: "Invalid testId" });
    }
    const questions = await QuestionService.getQuestionsByTest(
      testId,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json(questions);
  } catch (error) {
    return respondWithError(res, error, "Fetching questions failed");
  }
};
