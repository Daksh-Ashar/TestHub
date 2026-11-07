import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const publicMessages = new Map<string, { statusCode: number; message: string }>([
  ["Invalid credentials", { statusCode: 401, message: "Invalid credentials" }],
  ["Unauthorized", { statusCode: 401, message: "Unauthorized" }],
  ["Class not found", { statusCode: 404, message: "Class not found" }],
  ["Test not found", { statusCode: 404, message: "Test not found" }],
  ["No tests found for this class", { statusCode: 404, message: "No tests found for this class" }],
  ["No submissions found", { statusCode: 404, message: "No submissions found" }],
  ["No questions found for this test", { statusCode: 404, message: "No questions found for this test" }],
  ["User not found", { statusCode: 404, message: "User not found" }],
  ["Not authorized", { statusCode: 403, message: "Not authorized" }],
  ["Not authorized for this class", { statusCode: 403, message: "Not authorized for this class" }],
  ["Not authorized to view this test", { statusCode: 403, message: "Not authorized to view this test" }],
  ["Not authorized to view participants of this class", {
    statusCode: 403,
    message: "Not authorized to view participants of this class",
  }],
  ["Participant is not enrolled in this test's class", {
    statusCode: 403,
    message: "Participant is not enrolled in this test's class",
  }],
  ["Test is not published", { statusCode: 403, message: "Test is not published" }],
  ["Forbidden", { statusCode: 403, message: "Forbidden" }],
  ["Test already submitted", { statusCode: 409, message: "Test already submitted" }],
  ["User already exists", { statusCode: 409, message: "User already exists" }],
  ["Invalid answer format", { statusCode: 400, message: "Invalid answer format" }],
  ["Each question may only be answered once", {
    statusCode: 400,
    message: "Each question may only be answered once",
  }],
  ["Answer contains a question from another test", {
    statusCode: 400,
    message: "Answer contains a question from another test",
  }],
  ["Answer contains an invalid option for its question", {
    statusCode: 400,
    message: "Answer contains an invalid option for its question",
  }],
  ["Invalid role", { statusCode: 400, message: "Invalid role" }],
]);

const getErrorDetails = (error: unknown): { statusCode: number; message: string } => {
  if (error instanceof mongoose.Error.ValidationError) {
    return { statusCode: 400, message: "Invalid request data" };
  }

  if (error instanceof mongoose.Error.CastError) {
    return { statusCode: 400, message: "Invalid request data" };
  }

  if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
    return { statusCode: 409, message: "A resource with these details already exists" };
  }

  if (error instanceof Error) {
    const knownError = publicMessages.get(error.message);
    if (knownError) return knownError;

  }

  return { statusCode: 500, message: "Internal server error" };
};

export const respondWithError = (
  res: Response,
  error: unknown,
  context: string,
) => {
  const details = getErrorDetails(error);

  if (details.statusCode >= 500) {
    console.error(`${context}:`, error);
  }

  return res.status(details.statusCode).json({ message: details.message });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  respondWithError(res, error, "Unhandled request error");
};
