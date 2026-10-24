import mongoose, { Schema, Document } from "mongoose";

export interface Answer {
  questionId: mongoose.Types.ObjectId;
  selectedOptionId: string;
}

export interface ISubmission extends Document {
  testId: mongoose.Types.ObjectId;
  participantId: mongoose.Types.ObjectId;
  answers: Answer[];
  score: number;
}

const answerSchema = new Schema<Answer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOptionId: { type: String, required: true },
  },
  { _id: false }
);

const submissionSchema = new Schema<ISubmission>(
  {
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    participantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SubmissionModel = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);
