import { Router } from "express";
import { ClassController } from "./class.controller.js";
import { protect } from "../../middlewares/authMiddlewares.js";
import { requireRole } from "../../middlewares/authMiddlewares.js";
import { ROLES } from "../../constants/roles.js";
import { wrapAsync } from "../../types/express.js";

const router = Router();

// CREATOR only
router.post("/", protect, requireRole([ROLES.CREATOR]), wrapAsync(ClassController.createClass));

// PARTICIPANT only
router.post("/join", protect, requireRole([ROLES.PARTICIPANT]), wrapAsync(ClassController.joinClass));

// Both roles
router.get("/my", protect, wrapAsync(ClassController.getMyClasses));

// For creator role to view participants of ther classes.
router.get("/:classId/participants", protect, requireRole([ROLES.CREATOR]), wrapAsync(ClassController.getParticipants));

export default router;
