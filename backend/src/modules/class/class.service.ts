import { ClassModel } from "./class.model.js";
import type { IClass } from "./class.model.js";
import mongoose from "mongoose";
import { ROLES } from "../../constants/roles.js";
import type { Role } from "../../constants/roles.js";


export const generateJoinCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};



export class ClassService {
  // CREATOR creates a class
  static async createClass(
    name: string,
    description: string ,
    creatorId: mongoose.Types.ObjectId
  ): Promise<IClass> {
    let joinCode: string = "";
    let isUnique = false;

    // ensure joinCode is unique
    while (!isUnique) {
      joinCode = generateJoinCode();
      const exists = await ClassModel.findOne({ joinCode });
      if (!exists) isUnique = true;
    }

    const newClass = await ClassModel.create({
      name,
      description,
      creatorId,
      participants: [],
      joinCode,
    });

    return newClass;
  }

  // PARTICIPANT joins a class
  static async joinClass(participantId: mongoose.Types.ObjectId, joinCode: string) {
    const cls = await ClassModel.findOne({ joinCode });
    if (!cls) throw new Error("Class not found");

    // avoid duplicate join
    if (cls.participants.includes(participantId)) return cls;

    cls.participants.push(participantId);
    await cls.save();

    return cls;
  }

  // Fetch classes based on role
  static async getMyClasses(userId: mongoose.Types.ObjectId, role: Role) {

    if (role === ROLES.CREATOR) {
      return await ClassModel.find({ creatorId: userId }).select("_id joinCode createdAt name description");
    } else {
      return await ClassModel.find({ participants: userId }).select("_id joinCode createdAt name description");
    }
  }

  // Fetch participants of a class (for creator role)
  static async getParticipants(creatorId: mongoose.Types.ObjectId, classId: string) {
    const cls = await ClassModel.findById(classId).populate("participants", "name email");
    if (!cls) throw new Error("Class not found");
    if (cls.creatorId.toString() !== creatorId.toString()) {
      throw new Error("Not authorized to view participants of this class");
    }
    return cls.participants;
  }
}