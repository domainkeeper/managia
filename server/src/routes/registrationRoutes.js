import { Router } from "express";
import { getAll, getById } from "../controllers/registrationController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateAdmin, getAll);
router.get("/:id", authenticateAdmin, getById);

export default router;
