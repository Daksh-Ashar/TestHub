import mongoose, { Schema, Document } from "mongoose";

export interface Option {
  optionId: string;
  contentType: "text" | "image";
  contentValue: string;
  isCorrect: boolean;
}

export interface IQuestion extends Document {
  testId: mongoose.Types.ObjectId;
  questionText: string;
  options: Option[];
  createdBy: mongoose.Types.ObjectId;
}

const optionSchema = new Schema<Option>(
  {
    optionId: { type: String, required: true },
    contentType: { type: String, enum: ["text", "image"], default: "text" },
    contentValue: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const questionSchema = new Schema<IQuestion>(
  {
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    questionText: { type: String, required: true },
    options: [optionSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const QuestionModel = mongoose.model<IQuestion>(
  "Question",
  questionSchema
);
