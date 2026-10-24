import { TestModel } from "./test.model.js";
import { ClassModel } from "../class/class.model.js";
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


export const getTestByClassId = async (classId: string) => {
  const tests = await TestModel.find({ classId, isPublished: true });
  if(tests.length === 0) throw new Error("No tests found for this class");
  
  return tests;
}

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

    return await TestModel.find({
      classId: { $in: classIds },
      isPublished: true
    });
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
      return test;
    }
  }

  throw new Error("Not authorized to view this test");
};




