import type mongoose from "mongoose";
import type { ObjectId, Types } from "mongoose";

export const ROLES = {
  CREATOR: "creator",
  PARTICIPANT: "participant",
} as const;

// Optional: Type for role values
export type Role = typeof ROLES[keyof typeof ROLES];


export interface CreateClassBody {
  name: string;
  description: string;
}

export interface JoinClassBody {
  joinCode: string;
}

export interface CreateTestBody {
  title: string;
  description: string;
  classId: string;
  duration: number; // in minutes
}

export interface AddQuestionBody {
  testId: string;
  questionText: string;
  options: Options[];
  correctOptionIndex: number;
}

export interface Options {
  optionId : string;
  contentType : string;
  contentValue : string;
  isCorrect : boolean;
}

export interface answersBody {
  questionId: string;
  selectedOptionId: string;
}

export interface SubmitTestBody {
  testId: string;
  answers: answersBody[];
}

