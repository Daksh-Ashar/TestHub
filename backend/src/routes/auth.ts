import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../controllers/authControllers.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

export default router;
