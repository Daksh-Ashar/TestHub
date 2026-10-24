import { Router } from "express";
import * as QuestionController from "./question.controller.js";
import { ROLES } from "../../constants/roles.js";
import { protect, requireRole } from "../../middlewares/authMiddlewares.js";
import { wrapAsync } from "../../types/express.js";

const router = Router();

router.post(
  "/",
  protect,
  requireRole([ROLES.CREATOR]),
  wrapAsync(QuestionController.addQuestion)
);

router.get(
  "/test/:testId",
  protect,
  requireRole([ROLES.CREATOR, ROLES.PARTICIPANT]),
  wrapAsync(QuestionController.getQuestionsByTest)
);

export default router;
