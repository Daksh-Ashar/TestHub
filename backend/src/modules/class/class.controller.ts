import { Types } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import { ClassService } from "./class.service.js";
import type { CreateClassBody, JoinClassBody} from "../../constants/roles.js";
import type { AuthenticatedRequestWithBody } from "../../types/express.js";
import type { UserPayload } from "../../types/express.js";


export class ClassController {
  static async createClass(
    req: AuthenticatedRequestWithBody<CreateClassBody, UserPayload>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, description } = req.body;
      const creatorId = new Types.ObjectId(req.user.userId);
      const cls = await ClassService.createClass(name, description, creatorId);
      res.status(201).json(cls);
    } catch (err: any) {
      next(err);
    }
  }

  static async joinClass(
    req: AuthenticatedRequestWithBody<JoinClassBody, UserPayload>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { joinCode } = req.body;
      const participantId = new Types.ObjectId(req.user.userId);
      const cls = await ClassService.joinClass(participantId, joinCode);
      res.status(200).json(cls);
    } catch (err: any) {
      next(err);
    }
  }

  static async getMyClasses(
    req: AuthenticatedRequestWithBody<{}, UserPayload>,
    res: Response,
    next: NextFunction
  ) {
    try {
      
      const userId = new Types.ObjectId(req.user.userId);
      const role = req.user.role;
      const classes = await ClassService.getMyClasses(userId, role);
      res.status(200).json(classes);
    } catch (err: any) {
      next(err);
    }
  }

  static async getParticipants(
    req: AuthenticatedRequestWithBody<{classId:string}, UserPayload>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const creatorId = new Types.ObjectId(req.user.userId);
      const { classId } = req.params;
      
      if(classId == undefined )
      {
        res.status(400).json({ message: "Class ID is required" });
        return;
      } 

      if(typeof(classId) !== "string" || classId.length === 0)
      {
        res.status(400).json({ message: "Invalid Class ID" });
        return;
      }

      const participants = await ClassService.getParticipants(creatorId, classId);
      res.status(200).json(participants);
    } catch (err: any) {
      next(err);
    }
    }
}

