import { SubmissionModel } from "./submission.model.js";
import { QuestionModel } from "../question/question.model.js";
import { TestModel } from "../Exam/test.model.js";
import { ClassModel } from "../class/class.model.js";
import mongoose from "mongoose";

export class SubmissionRequestError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = "SubmissionRequestError";
  }
}


export const submitTest = async (
  testId: string,
  participantId: string,
  answers: { questionId: string; selectedOptionId: string }[]
) => {
  if (
    !mongoose.isValidObjectId(testId) ||
    !mongoose.isValidObjectId(participantId)
  ) {
    throw new SubmissionRequestError("Invalid test or participant");
  }

  const test = await TestModel.findById(testId).select("classId isPublished");
  if (!test) throw new SubmissionRequestError("Test not found", 404);
  if (!test.isPublished) {
    throw new SubmissionRequestError("Test is not published", 403);
  }

  const enrolled = await ClassModel.exists({
    _id: test.classId,
    participants: participantId,
  });
  if (!enrolled) {
    throw new SubmissionRequestError(
      "Participant is not enrolled in this test's class",
      403,
    );
  }

  if (!Array.isArray(answers)) {
    throw new SubmissionRequestError("Answers must be an array");
  }

  const questionIds = new Set<string>();
  for (const answer of answers) {
    if (
      !answer ||
      typeof answer.questionId !== "string" ||
      typeof answer.selectedOptionId !== "string" ||
      !mongoose.isValidObjectId(answer.questionId) ||
      !answer.selectedOptionId.trim()
    ) {
      throw new SubmissionRequestError("Invalid answer format");
    }

    if (questionIds.has(answer.questionId)) {
      throw new SubmissionRequestError(
        "Each question may only be answered once",
      );
    }
    questionIds.add(answer.questionId);
  }

  const questions = await QuestionModel.find({ testId });
  if (!questions.length) {
    throw new SubmissionRequestError("No questions found for this test");
  }

  const questionsById = new Map(
    questions.map((question) => [question._id.toString(), question]),
  );
  let score = 0;

  for (const ans of answers) {
    const question = questionsById.get(ans.questionId);
    if (!question) {
      throw new SubmissionRequestError(
        "Answer contains a question from another test",
      );
    }

    const selectedOption = question.options.find(
      (option) => option.optionId === ans.selectedOptionId,
    );
    if (!selectedOption) {
      throw new SubmissionRequestError(
        "Answer contains an invalid option for its question",
      );
    }

    if (selectedOption.isCorrect) score++;
  }

  try {
    return await SubmissionModel.create({
      testId,
      participantId,
      answers,
      score,
    });
  } catch (error: unknown) {
    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      throw new SubmissionRequestError("Test already submitted", 409);
    }

    throw error;
  }
};
