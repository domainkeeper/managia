import { Router } from "express";
import { getAll, getById, create, update, remove, getFeatured, getCategories } from "../controllers/eventController.js";
import { register } from "../controllers/registrationController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/", getAll);
router.get("/featured", getFeatured);
router.get("/categories", getCategories);
router.get("/:id", getById);
router.post("/:id/register", register);

// Admin
router.post("/", authenticateAdmin, create);
router.put("/:id", authenticateAdmin, update);
router.delete("/:id", authenticateAdmin, remove);

export default router;
