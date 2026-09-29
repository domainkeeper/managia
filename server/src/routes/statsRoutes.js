import { Router } from "express";
import { dashboard } from "../controllers/statsController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/stats", authenticateAdmin, dashboard);

export default router;
