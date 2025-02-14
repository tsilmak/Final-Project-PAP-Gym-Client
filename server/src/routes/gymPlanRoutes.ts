import { Router } from "express";
import { getGymPlans, getGymPlanById } from "../controllers/gymPlanController";

const router = Router();

router.get("/", getGymPlans);
router.get("/:id", getGymPlanById);

export default router;
