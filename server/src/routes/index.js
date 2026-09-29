import { Router } from "express";
import authRoutes from "./authRoutes.js";
import eventRoutes from "./eventRoutes.js";
import registrationRoutes from "./registrationRoutes.js";
import statsRoutes from "./statsRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/registrations", registrationRoutes);
router.use("/admin", statsRoutes);

export default router;
