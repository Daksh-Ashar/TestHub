import { QuestionModel } from "./question.model.js";
import { TestModel } from "../Exam/test.model.js";

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


export const getQuestionsByTest = async (testId: string) => {
  const test = await TestModel.findById(testId);
  if (!test) throw new Error("Test not found");

  const questions = await QuestionModel.find({ testId });
  return questions;
};

