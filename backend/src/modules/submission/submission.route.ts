import { Router } from "express";
import * as SubmissionController from "./submission.controller.js";
import { ROLES } from "../../constants/roles.js";
import { protect, requireRole } from "../../middlewares/authMiddlewares.js";
import { wrapAsync } from "../../types/express.js";

const router = Router();

router.post(
  "/",
  protect,
  requireRole([ROLES.PARTICIPANT]),
  wrapAsync(SubmissionController.submitTest)
);

export default router;
