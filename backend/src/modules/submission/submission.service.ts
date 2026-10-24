import { SubmissionModel } from "./submission.model.js";
const { QuestionModel } = await import("../question/question.model.js");


export const submitTest = async (
  testId: string,
  participantId: string,
  answers: { questionId: string; selectedOptionId: string }[]
) => {
  // 1 Check if already submitted
  const existing = await SubmissionModel.findOne({ testId, participantId });
  if (existing) throw new Error("Test already submitted");

  // 2️ Fetch questions
  const questions = await QuestionModel.find({ testId });
  if (!questions.length) throw new Error("No questions found for this test");

  // 3️ Evaluate score
  let score = 0;
  for (const ans of answers) {
    const question = questions.find(q => q._id.toString() === ans.questionId);
    if (!question) continue;

    const correctOption = question.options.find(opt => opt.isCorrect);
    if (correctOption?.optionId === ans.selectedOptionId) score++;
  }

  // 4️ Save submission
  const submission = await SubmissionModel.create({
    testId,
    participantId,
    answers,
    score,
  });

  return submission;
};
