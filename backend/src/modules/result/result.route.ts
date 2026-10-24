import { Router } from "express";
import * as ResultController from "./result.controller.js";
import { ROLES } from "../../constants/roles.js";
import { protect, requireRole } from "../../middlewares/authMiddlewares.js";

const router = Router();

// CREATOR route: view results for a specific test
router.get(
  "/test/:testId",
  protect,
  requireRole([ROLES.CREATOR]),
  ResultController.getTestResultsForCreator
);

// PARTICIPANT route: view own results
router.get(
  "/me",
  protect,
  requireRole([ROLES.PARTICIPANT]),
  ResultController.getParticipantResults
);

export default router;
