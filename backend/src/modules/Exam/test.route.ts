import { Router } from "express";
import * as TestController from "./test.controller.js";
import { protect } from "../../middlewares/authMiddlewares.js";
import { requireRole } from "../../middlewares/authMiddlewares.js";
import { ROLES } from "../../constants/roles.js";
import { wrapAsync } from "../../types/express.js";

const router = Router();

router.post(
  "/",
  protect,
  requireRole([ROLES.CREATOR]),
  wrapAsync(TestController.createTest)
);

router.patch(
  "/:testId/publish",
  protect,
  requireRole([ROLES.CREATOR]),
  wrapAsync(TestController.publishTest)
);

router.get(
  "/testList",
  protect,
  requireRole([ROLES.CREATOR, ROLES.PARTICIPANT]),
  wrapAsync(TestController.getTestListByRole)
);

router.get(
  "/:classId",
  protect,
  requireRole([ROLES.CREATOR, ROLES.PARTICIPANT]),
  wrapAsync(TestController.getTestByClassId)
);

router.get(
  "/:testId/info",
  protect,
  requireRole([ROLES.CREATOR, ROLES.PARTICIPANT]),
  wrapAsync(TestController.getBasicInfoByTestId)
);



export default router;
