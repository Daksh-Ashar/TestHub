import { SubmissionModel } from "../submission/submission.model.js";

export const getTestResultsForCreator = async (testId: string, creatorId: string) => {
  // Ensure test belongs to creator
  const submissions = await SubmissionModel.find({ testId }).populate("participantId", "name email");

  if (!submissions.length) throw new Error("No submissions found");

  // Calculate stats
  const scores = submissions.map(s => s.score);
  const total = scores.reduce((a, b) => a + b, 0);
  const avg = total / scores.length;
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  return { submissions, avg, max, min };
};

export const getParticipantResults = async (participantId: string) => {
  const submissions = await SubmissionModel.find({ participantId }).populate("testId", "title");

  if (!submissions.length) throw new Error("No submissions found");

  return submissions;
};
