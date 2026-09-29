import { Router } from "express";
import { login, me, logout } from "../controllers/authController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.get("/me", authenticateAdmin, me);
router.post("/logout", authenticateAdmin, logout);

export default router;
