import { Router } from "express";
import exerciseController from "../controllers/exerciseController";

const router = Router();

router.get("/all", exerciseController.getAllExercises);

export default router;
