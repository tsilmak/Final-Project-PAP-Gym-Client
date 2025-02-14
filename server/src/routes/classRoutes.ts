import { Router } from "express";
import classController from "../controllers/classController";

const router = Router();

router.get("/types", classController.getAllClassTypes);
router.get("/classes", classController.getAllClasses);
export default router;
