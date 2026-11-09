import { TestModel } from "./test.model.js";
import { ClassModel } from "../class/class.model.js";
import { SubmissionModel } from "../submission/submission.model.js";
import type { ObjectId } from "mongoose";
import { Types } from "mongoose";

export const createTest = async (
  title: string,
  description: string,
  classId: string,
  duration: number,
  creatorId: string
) => {
  const classExists = await ClassModel.findById(classId);

  if (!classExists) {
    throw new Error("Class not found");
  }

  if (classExists.creatorId.toString() !== creatorId) {
    throw new Error("Not authorized for this class");
  }

  const test = await TestModel.create({
    title,
    description,
    classId,
    duration,
    createdBy: creatorId,
  });

  return test;
};

export const publishTest = async (testId: string, creatorId: string) => {
  const test = await TestModel.findById(testId);

  if (!test) throw new Error("Test not found");

  if (test.createdBy.toString() !== creatorId) {
    throw new Error("Not authorized");
  }

  test.isPublished = true;
  await test.save();

  return test;
};


export const getTestByClassId = async (
  classId: string,
  userId: string,
  role: string,
) => {
  const tests = await TestModel.find({ classId, isPublished: true });
  if (tests.length === 0) throw new Error("No tests found for this class");

  if (role === "participant") {
    const submittedTestIds = new Set(
      (
        await SubmissionModel.find({
          participantId: userId,
          testId: { $in: tests.map((test) => test._id) },
        }).distinct("testId")
      ).map((testId) => testId.toString()),
    );

    return tests.map((test) => ({
      ...test.toObject(),
      hasSubmitted: submittedTestIds.has(test._id.toString()),
    }));
  }

  return tests;
};

export const getTestListByRole = async (userId: string, role: string) => {
  if (role === "creator") {
    // returns [] if no tests found (default mongoose behavior)
    return await TestModel.find({ createdBy: userId });
  }

  if (role === "participant") {
    const classes = await ClassModel.find({
      participants: userId
    }).select("_id");

    const classIds = classes.map((c) => c._id);

    // ✅ optimization: if no classes joined, skip DB call
    if (classIds.length === 0) return [];

    const tests = await TestModel.find({
      classId: { $in: classIds },
      isPublished: true
    });

    const submittedTestIds = new Set(
      (
        await SubmissionModel.find({
          participantId: userId,
          testId: { $in: tests.map((test) => test._id) },
        }).distinct("testId")
      ).map((testId) => testId.toString()),
    );

    return tests.map((test) => ({
      ...test.toObject(),
      hasSubmitted: submittedTestIds.has(test._id.toString()),
    }));
  }

  throw new Error("Invalid role");
};


export const getBasicInfoByTestId = async (testId: string, userId: Types.ObjectId, role: string) => {
  const test = await TestModel.findById(testId);
  if (!test) throw new Error("Test not found");
  
  if (role === "creator" && test.createdBy.equals(userId)) {
    return test;
  }

  if (role === "participant") {
    const classInfo = await ClassModel.findById(test.classId);
    if (!classInfo) throw new Error("Class not found");
  
    if (classInfo.participants.includes(userId) && test.isPublished) {
      const submission = await SubmissionModel.exists({
        testId: test._id,
        participantId: userId,
      });
      if (submission) throw new Error("Test already submitted");

      return test;
    }
  }

  throw new Error("Not authorized to view this test");
};



