import { Router } from "express";
import { getUserWorkoutPlan } from "../controllers/workoutController";
import verifyJWT from "../helpers/verifyJWT";

const router = Router();

router.post("/user", verifyJWT(), getUserWorkoutPlan);

export default router;
