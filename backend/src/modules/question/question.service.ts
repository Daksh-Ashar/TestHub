import { QuestionModel } from "./question.model.js";
import { TestModel } from "../Exam/test.model.js";
import { ClassModel } from "../class/class.model.js";
import { ROLES } from "../../constants/roles.js";
import type { Role } from "../../constants/roles.js";

export class QuestionRequestError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 403 | 404
  ) {
    super(message);
    this.name = "QuestionRequestError";
  }
}

export const addQuestion = async (
  testId: string,
  questionText: string,
  options: any[],
  creatorId: string
) => {
  const test = await TestModel.findById(testId);
  if (!test) throw new Error("Test not found");
  if (test.createdBy.toString() !== creatorId)
    throw new Error("Not authorized");

  const question = await QuestionModel.create({
    testId,
    questionText,
    options,
    createdBy: creatorId,
  });

  return question;
};


export const getQuestionsByTest = async (
  testId: string,
  userId: string,
  role: Role
) => {
  const test = await TestModel.findById(testId);
  if (!test) throw new QuestionRequestError("Test not found", 404);

  if (role === ROLES.CREATOR) {
    if (test.createdBy.toString() !== userId) {
      throw new QuestionRequestError("Not authorized to view this test", 403);
    }
  } else if (role === ROLES.PARTICIPANT) {
    if (!test.isPublished) {
      throw new QuestionRequestError("Not authorized to view this test", 403);
    }

    const isEnrolled = await ClassModel.exists({
      _id: test.classId,
      participants: userId,
    });
    if (!isEnrolled) {
      throw new QuestionRequestError("Not authorized to view this test", 403);
    }
  } else {
    throw new QuestionRequestError("Not authorized to view this test", 403);
  }

  const questions = await QuestionModel.find({ testId });

  if (role === ROLES.CREATOR) return questions;

  return questions.map((question) => {
    const questionData = question.toObject();
    return {
      ...questionData,
      options: questionData.options.map(
        ({ optionId, contentType, contentValue }) => ({
          optionId,
          contentType,
          contentValue,
        })
      ),
    };
  });
};
